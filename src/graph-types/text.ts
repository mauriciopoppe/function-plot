import { select as d3Select, Selection } from 'd3-selection'
import { hsl as d3Hsl } from 'd3-color'

import { color } from '../utils.mjs'

import { Chart } from '../index.js'
import { FunctionPlotDatum } from '../types.js'

export default function Text(chart: Chart) {
  const xScale = chart.meta.xScale
  const yScale = chart.meta.yScale

  function text(selection: Selection<any, FunctionPlotDatum, any, any>) {
    selection.each(function (d) {
      // Force some parameters to make it look like a vector.
      d.sampler = 'builtIn'
      d.fnType = 'vector'

      const innerSelection = d3Select(this).selectAll(':scope > text.fn-text').data([d.location])
      const innerSelectionEnter = innerSelection.enter().append('text').attr('class', `fn-text fn-text-${d.index}`)

      const computeColor = color(d, d.index)

      // enter + update
      const selection = innerSelection
        .merge(innerSelectionEnter)
        .attr('fill', d3Hsl(computeColor.toString()).brighter(1.5).formatHex())
        .attr('x', (d) => xScale(d[0]))
        .attr('y', (d) => yScale(d[1]))
        .text(() => d.text)

      if (d.attr) {
        for (const k in d.attr) {
          selection.attr(k, d.attr[k])
        }
      }

      // exit
      innerSelection.exit().remove()
    })
  }

  return text
}
