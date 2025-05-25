import './polyfills.js'

import { IntervalWorkerPool } from './samplers/interval_worker_pool.js'
import { FunctionPlotOptions } from './types.js'
import { Chart, ChartMeta, ChartMetaMargin } from './chart.js'

import globals from './globals.mjs'
import { interval, polyline, scatter, text } from './graph-types/index.js'
import { Mark } from './graph-types/mark.js'
import { interval as intervalEval, builtIn as builtInEval, registerSampler } from './samplers/eval.mjs'

function withWebWorkers(nWorkers = 8, WorkerConstructor = window.Worker, publicPath = window.location.href) {
  // @ts-ignore
  window.__webpack_public_path__ = publicPath
  globals.workerPool = new IntervalWorkerPool(nWorkers, WorkerConstructor)
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
  return instance.plot()
}

declare const __COMMIT_HASH__: string
functionPlot.version = __COMMIT_HASH__
functionPlot.globals = globals
functionPlot.$eval = {
  builtIn: builtInEval,
  interval: intervalEval
}
functionPlot.withWebWorkers = withWebWorkers

functionPlot.text = text
functionPlot.interval = interval
functionPlot.polyline = polyline
functionPlot.scatter = scatter

export * from './types.js'
export { Chart, ChartMeta, ChartMetaMargin }
export { withWebWorkers }
export { registerSampler }
export { Mark }
export { builtIn as EvalBuiltIn, interval as EvalInterval } from './samplers/eval.mjs'
export {
  interval as GraphTypeInterval,
  polyline as GraphTypePolyline,
  scatter as GraphTypeScatter,
  text as GraphTypeText
} from './graph-types/index.js'
export { GraphTypePlotter, GraphTypeBuilder } from './graph-types/types.js'
