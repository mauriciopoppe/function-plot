/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var d3 = window.d3
var dataBuilder = require('../data')
var utils = require('../utils')

module.exports = function (options) {
  var xScale = options.owner.meta.xScale
  var yScale = options.owner.meta.yScale

  function scatter (selection) {
    selection.each(function (data) {
      var i, j
      var color = utils.color(data, options.index)
      var evaluatedData = dataBuilder.eval(options, data)

      // scatter doesn't need groups, therefore each group is
      // flattened into a single array
      var joined = []
      for (i = 0; i < evaluatedData.length; i += 1) {
        for (j = 0; j < evaluatedData[i].length; j += 1) {
          joined.push(evaluatedData[i][j])
        }
      }

      var innerSelection = d3.select(this).selectAll(':scope > circle')
        .data(joined)

      innerSelection.enter()
        .append('circle')

      innerSelection
        .attr('fill', d3.hsl(color.toString()).brighter(1.5))
        .attr('stroke', color)
        .attr('opacity', 0.7)
        .attr('r', 1)
        .attr('cx', function (d) { return xScale(d[0]) })
        .attr('cy', function (d) { return yScale(d[1]) })

      innerSelection.exit().remove()
    })
  }

  return scatter
}
