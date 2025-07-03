import './polyfills.js'

import type { FunctionPlotOptions } from './types.js'
import type { ChartMeta, ChartMetaMargin } from './chart.js'
import { Chart, withWebWorkers } from './chart.js'

import globals from './globals.mjs'
import { interval, polyline, scatter, text, annotation } from './graph-types/index.js'
import { interval as intervalSampler, builtIn as builtInSampler } from './samplers/eval.mjs'

declare const __COMMIT_HASH__: string
functionPlot.version = __COMMIT_HASH__

/**
 * functionPlot is a function plotter of 2d functions.
 *
 * functionPlot creates an instance of {@link Chart} with the param options
 * and immediately calls {@link Chart#plot} on it.
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

functionPlot.globals = globals
functionPlot.withWebWorkers = withWebWorkers

functionPlot.builtInSampler = builtInSampler
functionPlot.intervalSampler = intervalSampler

functionPlot.interval = interval
functionPlot.polyline = polyline
functionPlot.scatter = scatter
functionPlot.text = text
functionPlot.annotation = annotation

export * from './types.js'
export { withWebWorkers }
export { Chart }
export type { ChartMeta, ChartMetaMargin }
export type { Attr } from './graph-types/index.js'
export {
  interval as IntervalGraph,
  Interval,
  polyline as PolylineGraph,
  Polyline,
  scatter as ScatterGraph,
  Scatter,
  text as TextGraph,
  Text,
  annotation as AnnotationGraph,
  Annotation,
  Mark
} from './graph-types/index.js'
export { builtIn as BuiltInSampler, interval as IntervalSampler, registerSampler } from './samplers/eval.mjs'
