/**
 * Created by mauricio on 3/29/15.
 */
'use strict';
var d3 = window.d3;

var Const = require('../constants');
var dataBuilder = require('../data');

module.exports = function (options) {
  var xScale = options.owner.meta.xScale;
  var yScale = options.owner.meta.yScale;

  function scatter(selection) {
    var index = options.index;

    selection.each(function (data) {
      var i, j;
      var fill = d3.hsl(Const.COLORS[index].toString());
      var evaluatedData = dataBuilder.eval(options.owner, data);

      // scatter doesn't need groups, therefore each group is
      // flattened into a single array
      var joined = [];
      for (i = 0; i < evaluatedData.length; i += 1) {
        for (j = 0; j < evaluatedData[i].length; j += 1) {
          joined.push(evaluatedData[i][j]);
        }
      }

      var innerSelection = d3.select(this).selectAll(':scope > circle')
        .data(joined);

      innerSelection.enter()
        .append('circle')
        .attr('fill', d3.hsl(fill.toString()).brighter(1.5))
        .attr('stroke', fill);

      innerSelection
        .attr('opacity', 0.7)
        .attr('r', 1)
        .attr('cx', function (d) { return xScale(d[0]); })
        .attr('cy', function (d) { return yScale(d[1]); });

      innerSelection.exit().remove();
    });
  }

  return scatter;
};
