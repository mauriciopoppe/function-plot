/**
 * Created by mauricio on 3/29/15.
 */
'use strict';
var d3 = window.d3;

var line = require('../type/line');

module.exports = function (options) {
  var xToEval;
  var dataBuilderConfig = {
    skipTip: true
  };

  function computeLine(d) {
    var x0 = d.derivative.x0 || xToEval;
    var y0 = d.fn(x0);
    var m = d.derivative.fn(x0);
    dataBuilderConfig.fn = function (x) {
      return m * (x - x0) + y0;
    };
  }

  function derivative(selection) {
    selection.each(function (d) {
      var el = d3.select(this);
      computeLine(d);
      var innerSelection = el.selectAll('g.derivative')
          .data([dataBuilderConfig]);

      innerSelection.enter()
          .append('g')
          .attr('class', 'derivative');

      // enter + update
      innerSelection
          .call(line(options));

      // change the opacity of the line
      innerSelection
        .selectAll('path')
        .attr('opacity', 0.5);
    });
  }

  derivative.x0 = function (_) {
    if (!arguments.length) {
      return xToEval;
    }
    xToEval = _;
    return this;
  };

  return derivative;
};
