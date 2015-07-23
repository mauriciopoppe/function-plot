/**
 * Created by mauricio on 3/29/15.
 */
'use strict';
var d3 = window.d3;

var evaluate = require('./eval').mathjs;
var line = require('../types/line');

module.exports = function (options) {
  var dataBuilderConfig = {
    skipTip: true,
    samples: 2,
    graphOptions: {
      sampler: 'mathjs'
    }
  };
  var derivative;

  function computeLine(d) {
    if (!d.derivative) {
      return [];
    }
    var x0 = typeof d.derivative.x0 === 'number' ? d.derivative.x0 : Infinity;
    dataBuilderConfig.scope = {
      m: evaluate(d.derivative, 'fn', {x: x0}),
      x0: x0,
      y0: evaluate(d, 'fn', {x: x0})
    };
    dataBuilderConfig.fn = 'm * (x - x0) + y0';
    return [dataBuilderConfig];
  }

  function checkAutoUpdate(d) {
    var self = this;
    if (!d.derivative) {
      return;
    }
    if (d.derivative.updateOnMouseMove && !d.derivative.$$mouseListener) {
      d.derivative.$$mouseListener = function (x0) {
        // update initial value to be the position of the mouse
        d.derivative.x0 = x0;
        // trigger update (selection = self)
        derivative(self);
      };
      options.owner.on('tip:update', d.derivative.$$mouseListener);
    }
  }

  derivative = function (selection) {
    selection.each(function (d) {
      var el = d3.select(this);
      var data = computeLine.call(selection, d);
      checkAutoUpdate.call(selection, d);
      var innerSelection = el.selectAll('g.derivative')
          .data(data);

      innerSelection.enter()
          .append('g')
          .attr('class', 'derivative');

      // enter + update
      innerSelection
          .call(line(options));

      // change the opacity of the line
      innerSelection.selectAll('path')
        .attr('opacity', 0.5);

      innerSelection.exit().remove();
    });
  };

  return derivative;
};
