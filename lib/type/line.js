/**
 * Created by mauricio on 3/29/15.
 */
'use strict';
var d3 = window.d3;

var Const = require('../constants');
var dataBuilder = require('../data');

module.exports = function (options) {
  options.split = options.split || [];

  var xScale = options.owner.xScale();
  var yScale = options.owner.yScale();
  var line = d3.svg.line()
    .interpolate(options.interpolate || 'cardinal')
    .x(function (d) { return xScale(d[0]).toFixed(3); })
    .y(function (d) { return yScale(d[1]).toFixed(3); });
  var area = d3.svg.area()
    .x(function (d) { return xScale(d[0]); })
    .y0(yScale(0))
    .y1(function (d) { return yScale(d[1]); });

  function plotLine(selection) {
    var index = options.index;

    selection.each(function (data) {
      var el = plotLine.el = d3.select(this);
      var evaluatedData = dataBuilder.eval(options.owner, data);
      var innerSelection = el.selectAll('path').data(evaluatedData);

      innerSelection.enter()
        .append('path')
        .attr('class', 'line line-' + index)
        //.attr('opacity', 0.7)
        .attr('stroke', Const.COLORS[index]);

      // enter + update
      innerSelection
        .each(function () {
          var path = d3.select(this);
          var d;
          if (options.closed) {
            path.attr('fill', d3.hsl(Const.COLORS[index].toString()).brighter(1.1));
            d = area;
          } else {
            path.attr('fill', 'none');
            d = line;
          }
          path.attr('d', d);
        });

      innerSelection.exit().remove();
    });
  }

  plotLine.onZoom = function () {

  };

  return plotLine;
};
