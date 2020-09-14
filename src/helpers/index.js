// const d3 = window.d3
import { select as d3Select } from 'd3-selection'
import derivative from './derivative'
import secant from './secant'

export default function helpers(chart) {
  function helper (selection) {
    selection.each(function () {
      const el = d3Select(this)
      el.call(derivative(chart))
      el.call(secant(chart))
    })
  }

  return helper
}
