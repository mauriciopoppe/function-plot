import type { Selection } from 'd3-selection'
import { hsl as d3Hsl } from 'd3-color'

import { color } from '../utils.mjs'
import { builtInEvaluate } from '../evaluate-datum.js'

import { Mark } from './mark.js'
import type { FunctionPlotDatum } from '../types.js'

export class Scatter extends Mark {
  fn?: any
  closed: boolean
  fnType: string
  nSamples: number
  sampler: string
  points?: Array<[number, number]>

  constructor(options: any) {
    super(options)
    this.fn = options.fn
    this.closed = options.closed
    this.fnType = options.fnType || 'linear'
    this.sampler = options.sampler || 'builtIn'
    this.nSamples = options.nSamples
    this.points = options.points
  }

  render(selection: Selection<any, FunctionPlotDatum, any, any>) {
    const index = this.index

    const evaluatedData = builtInEvaluate(this.chart, this as any)
    // scatter doesn't need groups, therefore each group is
    // flattened into a single array
    const joined = []
    for (let i = 0; i < evaluatedData.length; i += 1) {
      for (let j = 0; j < evaluatedData[i].length; j += 1) {
        joined.push(evaluatedData[i][j])
      }
    }

    const innerSelection = selection.selectAll(':scope > circle.scatter').data(joined)

    const cls = `scatter scatter-${index}`
    const innerSelectionEnter = innerSelection.enter().append('circle').attr('class', cls)

    const computedColor = color(this, index)
    const enterUpdateSelection = innerSelection
      .merge(innerSelectionEnter)
      .attr('fill', d3Hsl(computedColor.toString()).brighter(1.5).formatHex())
      .attr('stroke', computedColor)
      .attr('opacity', 0.7)
      .attr('r', 1)
      .attr('cx', (d) => this.chart.meta.xScale(d[0]))
      .attr('cy', (d) => this.chart.meta.yScale(d[1]))

    if (this.attr) {
      for (const k in this.attr) {
        // If the attribute to modify is class then append the default class
        // or otherwise the d3 selection won't work.
        let val = this.attr[k]
        if (k === 'class') {
          val = `${cls} ${this.attr[k]}`
        }
        enterUpdateSelection.attr(k, val)
      }
    }

    innerSelection.exit().remove()
  }
}

export function scatter(options: any) {
  return new Scatter(options)
}

// export default function Scatter(chart: Chart) {
//   const xScale = chart.meta.xScale
//   const yScale = chart.meta.yScale
//
//   function scatter(selection: Selection<any, FunctionPlotDatum, any, any>) {
//     selection.each(function (d) {
//       const index = d.index
//
//       const evaluatedData = builtInEvaluate(chart, d)
//       // scatter doesn't need groups, therefore each group is
//       // flattened into a single array
//       const joined = []
//       for (let i = 0; i < evaluatedData.length; i += 1) {
//         for (let j = 0; j < evaluatedData[i].length; j += 1) {
//           joined.push(evaluatedData[i][j])
//         }
//       }
//
//       const innerSelection = d3Select(this).selectAll(':scope > circle.scatter').data(joined)
//
//       const cls = `scatter scatter-${index}`
//       const innerSelectionEnter = innerSelection.enter().append('circle').attr('class', cls)
//
//       const computedColor = color(d, index)
//       const selection = innerSelection
//         .merge(innerSelectionEnter)
//         .attr('fill', d3Hsl(computedColor.toString()).brighter(1.5).formatHex())
//         .attr('stroke', computedColor)
//         .attr('opacity', 0.7)
//         .attr('r', 1)
//         .attr('cx', function (d) {
//           return xScale(d[0])
//         })
//         .attr('cy', function (d) {
//           return yScale(d[1])
//         })
//
//       if (d.attr) {
//         for (const k in d.attr) {
//           // If the attribute to modify is class then append the default class
//           // or otherwise the d3 selection won't work.
//           let val = d.attr[k]
//           if (k === 'class') {
//             val = `${cls} ${d.attr[k]}`
//           }
//           selection.attr(k, val)
//         }
//       }
//
//       innerSelection.exit().remove()
//     })
//   }
//
//   return scatter
// }
