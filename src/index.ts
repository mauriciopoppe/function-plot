import './polyfills'

import { IntervalWorkerPool } from './samplers/interval_worker_pool'
import { FunctionPlotOptions } from './types'
import { Chart, ChartMeta, ChartMetaMargin } from './chart'

import globals, { registerGraphType } from './globals'
import { polyline, interval, scatter, text } from './graph-types'
import { interval as intervalEval, builtIn as builtInEval } from './helpers/eval'

// register common graphTypes on library load.
registerGraphType('polyline', polyline)
registerGraphType('interval', interval)
registerGraphType('scatter', scatter)
registerGraphType('text', text)

// Web workers initializer.
function withWebWorkers(nWorkers = 8) {
  globals.workerPool = new IntervalWorkerPool(nWorkers)
}

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
functionPlot.$eval = {
  builtIn: builtInEval,
  interval: intervalEval
}
functionPlot.graphTypes = { interval, polyline, scatter }
functionPlot.withWebWorkers = withWebWorkers

export * from './types'
export { Chart, ChartMeta, ChartMetaMargin }
export { registerGraphType, withWebWorkers }
export { builtIn as EvalBuiltIn, interval as EvalInterval } from './helpers/eval'
export { TGlobals } from './globals'
export {
  interval as GraphTypeInterval,
  polyline as GraphTypePolyline,
  scatter as GraphTypeScatter
} from './graph-types'
export { GraphTypePlotter, GraphTypeBuilder } from './graph-types/types'
export * from './helpers'
