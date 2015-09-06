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
  var line = d3.svg.line()
    .interpolate('linear')
    .x(function (d) { return xScale(d[0]) })
    .y(function (d) { return yScale(d[1]) })
  var area = d3.svg.area()
    .x(function (d) { return xScale(d[0]) })
    .y0(yScale(0))
    .y1(function (d) { return yScale(d[1]) })

  function plotLine (selection) {
    var index = options.index

    selection.each(function (data) {
      var el = plotLine.el = d3.select(this)
      var evaluatedData = dataBuilder.eval(options, data)
      var color = utils.color(data, options.index)
      var innerSelection = el.selectAll(':scope > path.line')
        .data(evaluatedData)

      innerSelection.enter()
        .append('path')
        .attr('class', 'line line-' + index)
        .attr('stroke-width', 1)
        .attr('stroke-linecap', 'round')
        .each(function (d) {
          var path = d3.select(this)
          // special marker for vectors
          if (data.vector) {
            path.attr('marker-end', 'url(#' + options.owner.markerId + ')')
          }
        })

      // enter + update
      innerSelection
        .each(function () {
          var path = d3.select(this)
          var d
          if (options.closed) {
            path.attr('fill', color)
            path.attr('fill-opacity', 0.3)
            d = area
          } else {
            path.attr('fill', 'none')
            d = line
          }
          path
            .attr('stroke', color)
            .attr('d', d)
        })

      innerSelection.exit().remove()
    })
  }

  return plotLine
}
