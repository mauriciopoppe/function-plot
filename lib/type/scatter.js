/**
 * Created by mauricio on 3/29/15.
 */
var d3 = window.d3;

var Const = require('../constants');
var dataBuilder = require('../data');

module.exports = function () {
  var owner;

  function scatter(selection, index) {
    var xScale = owner.xScale();
    var yScale = owner.yScale();

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

  // public api
  scatter.owner = function (_owner) {
    owner = _owner;
    return scatter;
  };

  return scatter;
};
