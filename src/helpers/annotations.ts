import { line as d3Line } from 'd3-shape'
import { select as d3Select, Selection } from 'd3-selection'

import { FunctionPlotOptions } from '../types.js'
import { Chart } from '../index.js'

export default function annotations(options: { owner: Chart }) {
  const xScale = options.owner.meta.xScale
  const yScale = options.owner.meta.yScale

  const line = d3Line()
    .x(function (d) {
      return d[0]
    })
    .y(function (d) {
      return d[1]
    })

  return function (parentSelection: Selection<any, FunctionPlotOptions, any, any>) {
    parentSelection.each(function () {
      // join
      const current = d3Select(this)
      const selection = current.selectAll('g.annotations').data(function (d: FunctionPlotOptions) {
        return d.annotations || []
      })

      // enter
      const enter = selection.enter().append('g').attr('class', 'annotations')

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
    })
  }
}
