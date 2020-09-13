import { select as d3Select } from 'd3-selection'
import { line as d3Line, area as d3Area, curveLinear as d3CurveLinear } from 'd3-shape'
import clamp from 'clamp'

import utils from '../utils'
import evaluate from '../evaluate'


export default function polyline (chart) {
  var xScale = chart.meta.xScale
  var yScale = chart.meta.yScale
  function plotLine (selection) {
    selection.each(function (d) {
      var el = plotLine.el = d3Select(this)
      var index = d.index
      var evaluatedData = evaluate(chart, d)
      var color = utils.color(d, index)

      // join
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

      var line = d3Line()
        .curve(d3CurveLinear)
        .x(function (d) { return xScale(d[0]) })
        .y(y)
      var area = d3Area()
        .x(function (d) { return xScale(d[0]) })
        .y0(yScale(0))
        .y1(y)

      const innerSelectionEnter = innerSelection.enter()
        .append('path')
        .attr('class', 'line line-' + index)
        .attr('stroke-width', 1)
        .attr('stroke-linecap', 'round')

      // enter + update
      innerSelection.merge(innerSelectionEnter)
        .each(function () {
          var path = d3Select(this)
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
        // .attr(d => {
        //   if (d) console.log(d)
        //   d.attr
        // })

      // exit
      innerSelection.exit().remove()
    })
  }

  return plotLine
}
