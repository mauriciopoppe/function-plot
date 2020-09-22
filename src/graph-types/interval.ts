import {select as d3Select, Selection} from 'd3-selection'

import evaluate from '../evaluate'
import utils from '../utils'

import { Chart } from '../index'
import { Interval, FunctionPlotDatum } from '../function-plot'

export default function interval (chart: Chart) {
  let minWidthHeight: number
  const xScale = chart.meta.xScale
  const yScale = chart.meta.yScale

  function clampRange (vLo: number, vHi: number, gLo: number, gHi: number) {
    // issue 69
    // by adding the option `invert` to both the xAxis and the `yAxis`
    // it might be possible that after the transformation to canvas space
    // the y limits of the rectangle get inverted i.e. gLo > gHi
    //
    // e.g.
    //
    //   functionPlot({
    //     target: '#playground',
    //     yAxis: { invert: true },
    //     // ...
    //   })
    //
    if (gLo > gHi) {
      const t = gLo
      gLo = gHi
      gHi = t
    }
    const hi = Math.min(vHi, gHi)
    const lo = Math.max(vLo, gLo)
    if (lo > hi) {
      // no overlap
      return [-minWidthHeight, 0]
    }
    return [lo, hi]
  }

  const line = function (points: Interval[][], closed: boolean) {
    let path = ''
    const range = yScale.range()
    const minY = Math.min.apply(Math, range)
    const maxY = Math.max.apply(Math, range)
    for (let i = 0, length = points.length; i < length; i += 1) {
      if (points[i]) {
        const x = points[i][0]
        const y = points[i][1]
        let yLo = y.lo
        let yHi = y.hi
        // if options.closed is set to true then one of the bounds must be zero
        if (closed) {
          yLo = Math.min(yLo, 0)
          yHi = Math.max(yHi, 0)
        }
        // points.scaledDX is added because of the stroke-width
        const moveX = xScale(x.lo) + (points as any).scaledDx / 2
        const viewportY = clampRange(
          minY, maxY,
          isFinite(yHi) ? yScale(yHi) : -Infinity,
          isFinite(yLo) ? yScale(yLo) : Infinity
        )
        const vLo = viewportY[0]
        const vHi = viewportY[1]
        path += ' M ' + moveX + ' ' + vLo
        path += ' v ' + Math.max(vHi - vLo, minWidthHeight)
      }
    }
    return path
  }

  function plotLine (selection: Selection<any, FunctionPlotDatum, any, any>) {
    selection.each(function (d) {
      const el = (plotLine as any).el = d3Select(this)
      const index = d.index
      const closed = d.closed
      const evaluatedData = evaluate(chart, d)
      const innerSelection = el.selectAll(':scope > path.line')
        .data(evaluatedData)

      // the min height/width of the rects drawn by the path generator
      minWidthHeight = Math.max(evaluatedData[0].scaledDx, 1)

      const innerSelectionEnter = innerSelection.enter()
        .append('path')
        .attr('class', 'line line-' + index)
        .attr('fill', 'none')

      // enter + update
      innerSelection.merge(innerSelectionEnter)
        .attr('stroke-width', minWidthHeight)
        .attr('stroke', utils.color(d, index) as any)
        .attr('opacity', closed ? 0.5 : 1)
        .attr('d', function (d: Interval[][]) {
          return line(d, closed)
        })
        .attr(d.attr)

      innerSelection.exit().remove()
    })
  }

  return plotLine
}
