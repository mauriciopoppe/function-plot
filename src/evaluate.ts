import globals from './globals'
import interval from './samplers/interval'
import builtIn from './samplers/builtIn'

import { Chart } from './index'
import { FunctionPlotDatum } from './types'

type SamplerTypeFn = typeof interval | typeof builtIn

/**
 * Computes the endpoints x_lo, x_hi of the range
 * from which the sampler will take samples
 *
 * @param {Object} scale
 * @param {Object} d An item from `data`
 * @returns {Array}
 */
function computeEndpoints(scale: any, d: any): [number, number] {
  const range = d.range || [-Infinity, Infinity]
  const start = Math.max(scale.domain()[0], range[0])
  const end = Math.min(scale.domain()[1], range[1])
  return [start, end]
}

/**
 * Decides which sampler function to call based on the options
 * of `data`
 *
 * @param {Object} chart Chart instance which is orchestrating this sampling operation
 * @param {Object} d a.k.a a single item from `data`
 * @returns [number, number]
 */
function evaluate(chart: Chart, d: FunctionPlotDatum) {
  const range = computeEndpoints(chart.meta.xScale, d)

  let samplerFn: SamplerTypeFn
  if (d.sampler === 'builtIn') {
    samplerFn = builtIn
  } else if (d.sampler === 'interval') {
    samplerFn = interval
  } else {
    throw new Error(`Invalid sampler function ${d.sampler}`)
  }

  const nSamples = d.nSamples || Math.min(globals.MAX_ITERATIONS, globals.DEFAULT_ITERATIONS || chart.meta.width * 2)

  const data = samplerFn({
    d,
    range,
    xScale: chart.meta.xScale,
    yScale: chart.meta.yScale,
    xAxis: chart.options.xAxis,
    yAxis: chart.options.yAxis,
    nSamples
  })
  // NOTE: it's impossible to listen for the first eval event
  // as the event is already fired when a listener is attached
  chart.emit('eval', data, d.index, d.isHelper)
  return data
}

export default evaluate
