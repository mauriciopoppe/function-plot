/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var globals = require('./globals')

var evalTypeFn = {
  interval: require('./samplers/interval'),
  builtIn: require('./samplers/builtIn')
}

var evaluator = {
  /**
   * Computes the endpoints x_lo, x_hi of the range
   * from which the sampler will take samples
   *
   * @param {Chart} chart
   * @param {options} datum An item from `data`
   * @returns {[]}
   */
  range: function (chart, datum) {
    var range = datum.range || [-Infinity, Infinity]
    var scale = chart.meta.xScale
    var start = Math.max(scale.domain()[0], range[0])
    var end = Math.min(scale.domain()[1], range[1])
    return [start, end]
  },

  /**
   * Decides which sampler function to call based on the options
   * of `data`
   *
   * @param {Object} options The options received originally in any of `lib/types/*`
   * @param {Object} datum a.k.a a single item from `data`
   * @returns {Array}
   */
  eval: function (options, datum) {
    var chart = options.owner
    var range = this.range(chart, datum)
    var data
    var evalFn = evalTypeFn[datum.graphOptions.sampler]
    var nSamples = datum.samples || Math.min(
      globals.MAX_ITERATIONS,
      globals.DEFAULT_ITERATIONS || (chart.meta.width * 2)
    )
    data = evalFn(chart, datum, range, nSamples)
    // NOTE: it's impossible to listen for the first eval event
    // as the event is already fired when a listener is attached
    chart.emit('eval', data, options.index, options.isHelper)
    return data
  }
}

module.exports = evaluator
