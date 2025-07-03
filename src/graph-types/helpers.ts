import { select as d3Select } from 'd3-selection'
import type { Selection } from 'd3-selection'

import { derivative, type Derivative } from './derivative.js'
import { secant, type Secant } from './secant.js'
import { Chart } from '../chart.js'

export function helpers(chart: Chart) {
  function helper(selection: Selection<any, any, any, any>) {
    selection.each(function (d: any) {
      const el = d3Select(this)

      let mark: Derivative | Secant
      mark = derivative(d)
      mark.chart = chart
      mark.render(el)

      mark = secant(d)
      mark.chart = chart
      mark.render(el)
    })
  }

  return helper
}
