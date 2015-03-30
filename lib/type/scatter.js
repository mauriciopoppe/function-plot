/**
 * Created by mauricio on 3/29/15.
 */
var d3 = window.d3;

var Const = require('../constants');
var dataBuilder = require('../data');

module.exports = function (options) {
  function scatter(selection) {
    var index = options.index;
    var xScale = options.owner.xScale();
    var yScale = options.owner.yScale();

    selection.each(function (data) {
      var fill = d3.hsl(Const.COLORS[index].toString());
      d3.select(this).selectAll('circle')
        .data(dataBuilder.eval(data))
      .enter()
        .append('circle')
        .attr('class', 'circle circle-' + index)
        .attr('r', 2)
        .attr('cx', function (d) { return xScale(d[0]); })
        .attr('cy', function (d) { return yScale(d[1]); })
        .attr('fill', d3.hsl(fill.toString()).brighter(1.5))
        .attr('stroke', fill);
    });
  }

  return scatter;
};
