import type { Selection } from 'd3-selection'

import { asyncIntervalEvaluate, intervalEvaluate } from '../evaluate-datum.js'
import { infinity, color } from '../utils.mjs'
import { helpers } from './helpers.js'

import { Mark } from './mark.js'
import type { Interval as TInterval, FunctionPlotDatum, FunctionPlotScale } from '../types.js'
import type { IntervalSamplerResult } from '../samplers/types.js'

function clampRange(minWidthHeight: number, vLo: number, vHi: number, gLo: number, gHi: number) {
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

export function createPathD(
  xScale: FunctionPlotScale,
  yScale: FunctionPlotScale,
  minWidthHeight: number,
  points: Array<[TInterval, TInterval]>,
  closed: boolean
) {
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
        minWidthHeight,
        minY,
        maxY,
        isFinite(yHi) ? yScale(yHi) : -infinity(),
        isFinite(yLo) ? yScale(yLo) : infinity()
      )
      const vLo = viewportY[0]
      const vHi = viewportY[1]
      path += ' M ' + moveX + ' ' + vLo
      path += ' v ' + Math.max(vHi - vLo, minWidthHeight)
    }
  }
  return path
}

export class Interval extends Mark {
  fn?: any
  closed: boolean
  fnType: string
  sampler: string
  range?: [number, number]
  nSamples: number

  constructor(options: any) {
    super(options)
    this.fn = options.fn
    this.fnType = options.fnType || 'linear'
    this.sampler = options.sampler || 'interval'
    this.closed = options.closed
    this.range = options.range
    this.nSamples = options.nSamples
  }

  async render(selection: Selection<any, FunctionPlotDatum, any, any>) {
    const index = this.index
    const closed = this.closed
    let evaluatedData: IntervalSamplerResult
    if (this.fnType === 'linear' && typeof this.fn === 'string' && this.sampler === 'asyncInterval') {
      evaluatedData = await asyncIntervalEvaluate(this.chart, this as any)
    } else {
      evaluatedData = intervalEvaluate(this.chart, this as any)
    }
    const innerSelection = selection.selectAll(':scope > path.line').data(evaluatedData)

    // the min height/width of the rects drawn by the path generator
    const minWidthHeight = Math.max((evaluatedData[0] as any).scaledDx, 1)

    const cls = `line line-${index}`
    const innerSelectionEnter = innerSelection.enter().append('path').attr('class', cls).attr('fill', 'none')

    // enter + update
    innerSelection
      .merge(innerSelectionEnter)
      .attr('stroke-width', minWidthHeight)
      .attr('stroke', color(this, index) as any)
      .attr('opacity', closed ? 0.5 : 1)
      .attr('d', (d: Array<[TInterval, TInterval]>) => {
        return createPathD(this.chart.meta.xScale, this.chart.meta.yScale, minWidthHeight, d, closed)
      })

    if (this.attr) {
      for (const k in this.attr) {
        // If the attribute to modify is class then append the default class
        // or otherwise the d3 selection won't work.
        let val = this.attr[k]
        if (k === 'class') {
          val = `${cls} ${this.attr[k]}`
        }
        selection.attr(k, val)
      }
    }

    innerSelection.exit().remove()

    selection.call(helpers(this.chart))
  }
}

export function interval(options: any) {
  return new Interval(options)
}
