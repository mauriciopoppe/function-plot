import './polyfills'

import { FunctionPlotOptions } from './types'
import { Chart } from './chart'

import globals, { registerGraphType } from './globals'
import { polyline, interval, scatter, text } from './graph-types'
import * as $eval from './helpers/eval'

// register common graphTypes on library load.
registerGraphType('polyline', polyline)
registerGraphType('interval', interval)
registerGraphType('scatter', scatter)
registerGraphType('text', text)

/**
 * functionPlot is a function plotter of 2d functions.
 *
 * functionPlot creates an instance of {@link Chart} with the param options
 * and immediately calls {@link Chart#build} on it.
 *
 * `options` is augmented with additional internal computed data,
 * therefore, if you want to rerender graphs it's important to reuse
 * the same object to preserve state across builds.
 *
 * @param options The options sent to Chart
 */
export default function functionPlot(options: FunctionPlotOptions) {
  options.data = options.data || []
  let instance = Chart.cache[options.id]
  if (!instance) {
    instance = new Chart(options)
  }
  return instance.build()
}

functionPlot.globals = globals
functionPlot.$eval = $eval
functionPlot.graphTypes = { interval, polyline, scatter }

export * from './types'
export { Chart }
export { registerGraphType }
export { builtIn as EvalBuiltIn, interval as EvalInterval } from './helpers/eval'
export {
  interval as GraphTypeInterval,
  polyline as GraphTypePolyline,
  scatter as GraphTypeScatter
} from './graph-types'
export * from './helpers'
