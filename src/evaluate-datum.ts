import globals from './globals.mjs'
import { syncSamplerInterval, asyncSamplerInterval } from './samplers/interval.js'
import builtIn from './samplers/builtIn.js'

import { Chart } from './index.js'
import { FunctionPlotDatum, FunctionPlotScale } from './types.js'

/**
 * Computes the endpoints x_lo, x_hi of the range in d.range from which the sampler will take samples.
 */
function getRange(scale: FunctionPlotScale, d: FunctionPlotDatum): [number, number] {
  const range = d.range || [-Infinity, Infinity]
  const start = Math.max(scale.domain()[0], range[0])
  const end = Math.min(scale.domain()[1], range[1])
  return [start, end]
}

function getSamples(nSamples: number, chartWidth: number) {
  return nSamples || Math.min(globals.MAX_ITERATIONS, globals.DEFAULT_ITERATIONS || chartWidth * 2)
}

/**
 * Decides which sampler function to call based on the options
 * of `data`
 *
 * @param {Object} chart Chart instance which is orchestrating this sampling operation
 * @param {Object} d a.k.a a single item from `data`
 * @returns [number, number]
 */
function builtInEvaluate(chart: Chart, d: FunctionPlotDatum) {
  const data = builtIn({
    d,
    range: getRange(chart.meta.xScale, d),
    xScale: chart.meta.xScale,
    yScale: chart.meta.yScale,
    xAxis: chart.options.x,
    yAxis: chart.options.y,
    nSamples: getSamples(d.nSamples, chart.meta.width)
  })
  // NOTE: it's impossible to listen for the first eval event
  // as the event is already fired when a listener is attached
  chart.emit('eval', data, d.index, d.isHelper)
  return data
}

function intervalEvaluate(chart: Chart, d: FunctionPlotDatum) {
  const data = syncSamplerInterval({
    d,
    range: getRange(chart.meta.xScale, d),
    xScale: chart.meta.xScale,
    yScale: chart.meta.yScale,
    xAxis: chart.options.x,
    yAxis: chart.options.y,
    nSamples: getSamples(d.nSamples, chart.meta.width)
  })
  // NOTE: it's impossible to listen for the first eval event
  // as the event is already fired when a listener is attached
  chart.emit('eval', data, d.index, d.isHelper)
  return data
}

async function asyncIntervalEvaluate(chart: Chart, d: FunctionPlotDatum) {
  const data = asyncSamplerInterval({
    d,
    range: getRange(chart.meta.xScale, d),
    xScale: chart.meta.xScale,
    yScale: chart.meta.yScale,
    xAxis: chart.options.x,
    yAxis: chart.options.y,
    nSamples: getSamples(d.nSamples, chart.meta.width)
  })
  // NOTE: it's impossible to listen for the first eval event
  // as the event is already fired when a listener is attached
  chart.emit('eval', data, d.index, d.isHelper)
  return data
}

export { builtInEvaluate, intervalEvaluate, asyncIntervalEvaluate }
