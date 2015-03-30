/**
 * Created by mauricio on 3/29/15.
 */
var d3 = window.d3;

var Const = require('../constants');
var dataBuilder = require('../data');

module.exports = function () {
  var owner;

  function plotLine(selection, index) {
    var xScale = owner.xScale();
    var yScale = owner.yScale();

    selection.each(function (data) {
      d3.select(this).append('path')
        .datum(dataBuilder.eval(data))
        .attr('class', 'line line-' + index)
        .attr('fill', 'none')
        .attr('stroke', Const.COLORS[index])
        .attr('d', d3.svg.line()
          .interpolate('cardinal')
          .x(function (d) { return xScale(d[0]); })
          .y(function (d) { return yScale(d[1]); })
        );
    });
  }

  // public api
  plotLine.owner = function (_owner) {
    owner = _owner;
    return plotLine;
  };

  return plotLine;
};
