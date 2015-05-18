/**
 * Created by mauricio on 3/29/15.
 */
'use strict';
var utils = require('./utils');
var assert = utils.assert;

var evalTypeFn = {
  interval: require('./samplers/interval'),
  scatter: require('./samplers/scatter'),
  line: require('./samplers/line')
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
    var evalFn = evalTypeFn[meta.graphOptions.type];
    var linearX = utils.linspace(range, meta.samples || Math.min(2000, chart.meta.width * 3));
    data = evalFn(chart, meta, linearX);
    return data;
  }
};

module.exports = evaluator;
