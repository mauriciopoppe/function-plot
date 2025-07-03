import { select as d3Select } from 'd3-selection'
import type { Selection } from 'd3-selection'
import { line as d3Line, area as d3Area, curveLinear as d3CurveLinear } from 'd3-shape'

import { color, infinity, clamp } from '../utils.mjs'
import { builtInEvaluate } from '../evaluate-datum.js'
import { helpers } from './helpers.js'

import { Mark } from './mark.js'
import type { FunctionPlotDatum } from '../types.js'

export class Polyline extends Mark {
  fn?: any
  x?: any
  y?: any
  r?: any
  vector?: [number, number]
  offset?: [number, number]
  range?: [number, number]
  points?: Array<[number, number]>
  closed: boolean
  fnType: string
  sampler: string
  skipBoundsCheck: boolean
  scope: object
  nSamples: number

  constructor(options: any) {
    super(options)
    this.fn = options.fn
    this.fnType = options.fnType || 'linear'
    this.sampler = options.sampler || 'builtIn'
    this.x = options.x
    this.y = options.y
    this.r = options.r
    this.vector = options.vector
    this.offset = options.offset
    this.range = options.range
    this.points = options.points
    this.closed = options.closed
    this.scope = options.scope
    this.nSamples = options.nSamples
    this.skipBoundsCheck = options.skipBoundsCheck
  }

  render(selection: Selection<any, FunctionPlotDatum, any, any>) {
    const self = this
    const index = this.index
    const evaluatedData = builtInEvaluate(this.chart, this as any)
    const computedColor = color(this, index)

    const yRange = this.chart.meta.yScale.range()
    let yMax = yRange[0]
    let yMin = yRange[1]

    // Fix #342
    // When yAxis is reversed, the yRange is inverted, i.e. yMin > yMax
    if (yMin > yMax) [yMin, yMax] = [yMax, yMin]

    // workaround, clamp assuming that the bounds are finite but huge
    const diff = yMax - yMin
    yMax += diff * 1e6
    yMin -= diff * 1e6
    if (this.skipBoundsCheck) {
      yMax = infinity()
      yMin = -infinity()
    }

    function y(d: number[]) {
      return clamp(self.chart.meta.yScale(d[1]), yMin, yMax)
    }

    const line = d3Line()
      .curve(d3CurveLinear)
      .x(function (d) {
        return self.chart.meta.xScale(d[0])
      })
      .y(y)
    const area = d3Area()
      .x(function (d) {
        return self.chart.meta.xScale(d[0])
      })
      .y0(self.chart.meta.yScale(0))
      .y1(y)

    const vectorMarkerId = `${this.id}-vector-marker`
    if (this.fnType === 'vector') {
      // vector
      const vectorInnerSelection = selection.selectAll(':scope > defs').data(evaluatedData)
      // enter
      vectorInnerSelection
        .enter()
        .append('defs')
        .append('clipPath')
        .append('marker')
        .attr('id', vectorMarkerId)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 10)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5L0,0')
        .attr('stroke-width', '0px')
        .attr('fill-opacity', 1)

      // enter + update
      vectorInnerSelection.merge(vectorInnerSelection.enter().selectAll('defs')).each(function () {
        d3Select(this).selectAll('path').attr('fill', computedColor)
      })

      // exit
      vectorInnerSelection.exit().remove()
    }

    // join
    const innerSelection = selection.selectAll(':scope > path.line').data(evaluatedData)

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
      let pathD: any
      if (self.closed) {
        path.attr('fill', computedColor)
        path.attr('fill-opacity', 0.3)
        pathD = area
      } else {
        path.attr('fill', 'none')
        pathD = line
      }
      path
        .attr('stroke', computedColor)
        .attr('marker-end', function () {
          // special marker for vectors
          return self.fnType === 'vector' ? `url(#${vectorMarkerId})` : null
        })
        .attr('d', pathD)

      if (self.attr) {
        for (const k in self.attr) {
          // If the attribute to modify is class then append the default class
          // or otherwise the d3 selection won't work.
          let val = self.attr[k]
          if (k === 'class') {
            val = `${cls} ${self.attr[k]}`
          }
          path.attr(k, val)
        }
      }
    })

    // exit
    innerSelection.exit().remove()

    selection.call(helpers(this.chart))
  }
}

export function polyline(options: any) {
  return new Polyline(options)
}
