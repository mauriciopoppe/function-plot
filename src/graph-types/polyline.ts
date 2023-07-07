import { select as d3Select, Selection } from 'd3-selection'
import { line as d3Line, area as d3Area, curveLinear as d3CurveLinear } from 'd3-shape'
import clamp from 'clamp'

import utils from '../utils'
import evaluate from '../evaluate'

import { Chart } from '../index'
import { FunctionPlotDatum } from '../types'

export default function polyline(chart: Chart) {
  function plotLine(selection: Selection<any, FunctionPlotDatum, any, any>) {
    selection.each(function (d) {
      const el = ((plotLine as any).el = d3Select(this))
      const index = d.index
      const evaluatedData = evaluate(chart, d)
      const color = utils.color(d, index)

      // join
      const innerSelection = el.selectAll(':scope > path.line').data(evaluatedData)

      const yRange = chart.meta.yScale.range()
      let yMax = yRange[0]
      let yMin = yRange[1]
      // workaround, clamp assuming that the bounds are finite but huge
      const diff = yMax - yMin
      yMax += diff * 1e6
      yMin -= diff * 1e6
      if (d.skipBoundsCheck) {
        yMax = Infinity
        yMin = -Infinity
      }

      function y(d: number[]) {
        return clamp(chart.meta.yScale(d[1]), yMin, yMax)
      }

      const line = d3Line()
        .curve(d3CurveLinear)
        .x(function (d) {
          return chart.meta.xScale(d[0])
        })
        .y(y)
      const area = d3Area()
        .x(function (d) {
          return chart.meta.xScale(d[0])
        })
        .y0(chart.meta.yScale(0))
        .y1(y)

      const cls = `line line-${index}`
      const innerSelectionEnter = innerSelection
        .enter()
        .append('path')
        .attr('class', cls)
        .attr('stroke-width', 1)
        .attr('stroke-linecap', 'round')

      // enter + update
      innerSelection.merge(innerSelectionEnter).each(function () {
        const path = d3Select(this)
        let pathD
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
            return d.fnType === 'vector' ? 'url(#' + chart.markerId + ')' : null
          })
          .attr('d', pathD)

        if (d.attr) {
          for (const k in d.attr) {
            // If the attribute to modify is class then append the default class
            // or otherwise the d3 selection won't work.
            let val = d.attr[k]
            if (k === 'class') {
              val = `${cls} ${d.attr[k]}`
            }
            path.attr(k, val)
          }
        }
      })

      // exit
      innerSelection.exit().remove()
    })
  }

  return plotLine
}
