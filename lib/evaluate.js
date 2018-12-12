/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var globals = require('./globals')
var evalTypeFn = {
  interval: require('./samplers/interval'),
  builtIn: require('./samplers/builtIn')
}

/**
 * Computes the endpoints x_lo, x_hi of the range
 * from which the sampler will take samples
 *
 * @param {Chart} chart
 * @param {Object} d An item from `data`
 * @returns {Array}
 */
function computeEndpoints (chart, d) {
  var range = d.range || [-Infinity, Infinity]
  var scale = chart.meta.xScale
  var start = Math.max(scale.domain()[0], range[0])
  var end = Math.min(scale.domain()[1], range[1])
  return [start, end]
}

/**
 * Decides which sampler function to call based on the options
 * of `data`
 *
 * @param {Object} chart Chart instance which is orchestating this sampling operation
 * @param {Object} d a.k.a a single item from `data`
 * @returns {Array}
 */
function evaluate (chart, d) {
  var range = computeEndpoints(chart, d)
  var data
  var evalFn = evalTypeFn[d.sampler]
  var nSamples = d.nSamples || Math.min(
    globals.MAX_ITERATIONS,
    globals.DEFAULT_ITERATIONS || (chart.meta.width * 2)
  )
  data = evalFn(chart, d, range, nSamples)
  // NOTE: it's impossible to listen for the first eval event
  // as the event is already fired when a listener is attached
  chart.emit('eval', data, d.index, d.isHelper)
  return data
}

module.exports = evaluate
