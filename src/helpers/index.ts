import { select as d3Select, Selection } from 'd3-selection'
import derivative from './derivative'
import secant from './secant'

import { Chart } from '../index'

export default function helpers(chart: Chart) {
  function helper(selection: Selection<any, any, any, any>) {
    selection.each(function () {
      const el = d3Select(this)
      el.call(derivative(chart))
      el.call(secant(chart))
    })
  }

  return helper
}
