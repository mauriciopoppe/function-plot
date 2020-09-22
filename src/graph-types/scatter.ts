import {select as d3Select, Selection} from 'd3-selection'
import { hsl as d3Hsl } from 'd3-color'

import utils from '../utils'
import evaluate from '../evaluate'

import { Chart } from '../index'
import { FunctionPlotDatum } from '../function-plot'

export default function scatter (chart: Chart) {
  const xScale = chart.meta.xScale
  const yScale = chart.meta.yScale

  function scatter (selection: Selection<any, FunctionPlotDatum, any, any>) {
    selection.each(function (d) {
      let i, j
      const index = d.index
      const color = utils.color(d, index)
      const evaluatedData = evaluate(chart, d)

      // scatter doesn't need groups, therefore each group is
      // flattened into a single array
      const joined = []
      for (i = 0; i < evaluatedData.length; i += 1) {
        for (j = 0; j < evaluatedData[i].length; j += 1) {
          joined.push(evaluatedData[i][j])
        }
      }

      const innerSelection = d3Select(this)
        .selectAll(':scope > circle')
        .data(joined)

      const innerSelectionEnter = innerSelection.enter()
        .append('circle')

      innerSelection.merge(innerSelectionEnter)
        .attr('fill', d3Hsl(color.toString()).brighter(1.5).hex())
        .attr('stroke', color)
        .attr('opacity', 0.7)
        .attr('r', 1)
        .attr('cx', function (d) { return xScale(d[0]) })
        .attr('cy', function (d) { return yScale(d[1]) })
        .attr(d.attr)

      innerSelection.exit().remove()
    })
  }

  return scatter
}
