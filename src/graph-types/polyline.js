/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var d3 = window.d3
var evaluate = require('../evaluate')
var utils = require('../utils')
var clamp = require('clamp')

module.exports = function (chart) {
  var xScale = chart.meta.xScale
  var yScale = chart.meta.yScale
  function plotLine (selection) {
    selection.each(function (d) {
      var el = plotLine.el = d3.select(this)
      var index = d.index
      var evaluatedData = evaluate(chart, d)
      var color = utils.color(d, index)
      var innerSelection = el.selectAll(':scope > path.line')
        .data(evaluatedData)

      var yRange = yScale.range()
      var yMax = yRange[0]
      var yMin = yRange[1]
      // workaround, clamp assuming that the bounds are finite but huge
      var diff = yMax - yMin
      yMax += diff * 1e6
      yMin -= diff * 1e6
      if (d.skipBoundsCheck) {
        yMax = Infinity
        yMin = -Infinity
      }

      function y (d) {
        return clamp(yScale(d[1]), yMin, yMax)
      }

      var line = d3.svg.line()
        .interpolate('linear')
        .x(function (d) { return xScale(d[0]) })
        .y(y)
      var area = d3.svg.area()
        .x(function (d) { return xScale(d[0]) })
        .y0(yScale(0))
        .y1(y)

      innerSelection.enter()
        .append('path')
        .attr('class', 'line line-' + index)
        .attr('stroke-width', 1)
        .attr('stroke-linecap', 'round')

      // enter + update
      innerSelection
        .each(function () {
          var path = d3.select(this)
          var pathD
          if (d.closed) {
            path.attr('fill', color)
            path.attr('fill-opacity', 0.3)
            pathD = area
          } else {
            path.attr('fill', 'none')
            pathD = line
          }
          path
            .attr('stroke', color)
            .attr('marker-end', function () {
              // special marker for vectors
              return d.fnType === 'vector'
                ? 'url(#' + chart.markerId + ')'
                : null
            })
            .attr('d', pathD)
        })
        .attr(d.attr)

      innerSelection.exit().remove()
    })
  }

  return plotLine
}
