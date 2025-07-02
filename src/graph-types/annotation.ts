import { line as d3Line } from 'd3-shape'
import type { Selection } from 'd3-selection'

import type { FunctionPlotOptions } from '../types.js'
import { Mark } from '../graph-types/mark.js'

const line = d3Line()
  .x((d) => d[0])
  .y((d) => d[1])

export class Annotation extends Mark {
  constructor(options: any) {
    super(options)
  }

  render(parentSelection: Selection<any, FunctionPlotOptions, any, any>) {
    // join
    const selection = parentSelection.selectAll('g.annotations').data(function (d: FunctionPlotOptions) {
      return d.annotations || []
    })

    // enter
    const enter = selection.enter().append('g').attr('class', 'annotations')

    const xScale = this.chart.meta.xScale
    const yScale = this.chart.meta.yScale

    // enter + update
    // - path
    const yRange = yScale.range()
    const xRange = xScale.range()

    // prettier-ignore
    const path = selection.merge(enter).selectAll('path')
        .data(function (d) {
          if ('x' in d) {
            return [[[0, yRange[0]], [0, yRange[1]]]]
          } else {
            return [[[xRange[0], 0], [xRange[1], 0]]]
          }
        })
    // enter
    const pathEnter = path.enter().append('path')
    // enter + update
    path
      .merge(pathEnter)
      .attr('stroke', '#eee')
      .attr('d', line as any)
    path.exit().remove()

    // join
    const text = selection
      .merge(enter)
      .selectAll('text')
      .data((d) => [
        {
          label: d.label || '',
          // used to determine if x or y is set.
          xIsSet: 'x' in d
        }
      ])
    // enter
    const textEnter = text.enter().append('text')
    // enter + update
    text
      .merge(textEnter)
      .text((d) => d.label)
      .attr('y', function (d) {
        return d.xIsSet ? 3 : 0
      })
      .attr('x', function (d) {
        return d.xIsSet ? 0 : 3
      })
      .attr('dy', function (d) {
        return d.xIsSet ? 5 : -5
      })
      .attr('text-anchor', function (d) {
        return d.xIsSet ? 'end' : ''
      })
      .attr('transform', function (d) {
        return d.xIsSet ? 'rotate(-90)' : ''
      })
    text.exit().remove()

    // enter + update
    // move group
    selection.merge(enter).attr('transform', function (d) {
      if ('x' in d) {
        return 'translate(' + xScale(d.x) + ', 0)'
      } else {
        return 'translate(0, ' + yScale(d.y) + ')'
      }
    })

    // exit
    selection.exit().remove()
  }
}

export function annotation(options: any) {
  return new Annotation(options)
}
