/**
 * Created by mauricio on 3/29/15.
 */
'use strict';
var utils = require('./utils');
var constants = require('./constants');
var assert = utils.assert;

var evalTypeFn = {
  interval: require('./samplers/interval'),
  mathjs: require('./samplers/mathjs')
};

var evaluator = {
  range: function (chart, meta) {
    var range = meta.range || [-Infinity, Infinity];
    var scale = chart.meta.xScale;
    var start = Math.max(scale.domain()[0], range[0]);
    var end = Math.min(scale.domain()[1], range[1]);
    return [start, end];
  },

  eval: function (chart, meta) {
    var range = this.range(chart, meta);
    var data;
    var evalFn = evalTypeFn[meta.graphOptions.sampler];
    var nSamples = meta.samples || Math.min(
      constants.MAX_ITERATIONS,
      constants.DEFAULT_ITERATIONS || (chart.meta.width * 3)
    );
    data = evalFn(chart, meta, range, nSamples);
    return data;
  }
};

module.exports = evaluator;
