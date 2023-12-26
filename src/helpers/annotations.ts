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
      path
        .enter()
        .append('path')
        .attr('stroke', '#eee')
        .attr('d', line as any)
      path.exit().remove()

      // enter + update
      // - text
      const text = selection
        .merge(enter)
        .selectAll('text')
        .data(function (d) {
          return [
            {
              text: d.text || '',
              hasX: 'x' in d
            }
          ]
        })
      text
        .enter()
        .append('text')
        .attr('y', function (d) {
          return d.hasX ? 3 : 0
        })
        .attr('x', function (d) {
          return d.hasX ? 0 : 3
        })
        .attr('dy', function (d) {
          return d.hasX ? 5 : -5
        })
        .attr('text-anchor', function (d) {
          return d.hasX ? 'end' : ''
        })
        .attr('transform', function (d) {
          return d.hasX ? 'rotate(-90)' : ''
        })
        .text(function (d) {
          return d.text
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
