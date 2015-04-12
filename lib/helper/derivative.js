/**
 * Created by mauricio on 3/29/15.
 */
'use strict';
var d3 = window.d3;

var line = require('../types/line');

module.exports = function (options) {
  var dataBuilderConfig = {
    skipTip: true
  };
  var derivative;

  function computeLine(d) {
    var x0 = d.derivative.x0;
    var y0 = d.fn(x0);
    var m = d.derivative.fn(x0);
    dataBuilderConfig.fn = function (x) {
      return m * (x - x0) + y0;
    };
  }

  function checkAutoUpdate(d) {
    var self = this;
    if (d.derivative.updateOnMouseOver && !d.derivative.$$mouseListener) {
      d.derivative.$$mouseListener = function (x0) {
        // update initial value to be the position of the mouse
        d.derivative.x0 = x0;
        // trigger update (selection = this)
        derivative(self);
      };
      options.owner.on('tip:update', d.derivative.$$mouseListener);
    }
  }

  derivative = function (selection) {
    selection.each(function (d) {
      var el = d3.select(this);
      computeLine.call(selection, d);
      checkAutoUpdate.call(selection, d);
      var innerSelection = el.selectAll('g.derivative')
          .data([dataBuilderConfig]);

      innerSelection.enter()
          .append('g')
          .attr('class', 'derivative');

      // enter + update
      innerSelection
          .call(line(options));

      // change the opacity of the line
      innerSelection.selectAll('path')
        .attr('opacity', 0.5);
    });
  };

  return derivative;
};
