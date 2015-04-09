/**
 * Created by mauricio on 3/29/15.
 */
'use strict';

var utils = require('./utils');
var assert = utils.assert;
module.exports = {
  range: function (chart, meta) {
    var range = meta.range || [-Infinity, Infinity];
    var scale = chart.xZoomScale();
    var start = Math.max(scale.domain()[0], range[0]);
    var end = Math.min(scale.domain()[1], range[1]);
    return [start, end];
  },

  eval: function (chart, meta) {
    assert(typeof meta.fn === 'function');
    var data = [];
    var range = this.range(chart, meta);
    var start = range[0];
    var end = range[1];

    var delta = meta.increment || (end - start) / 100;
    var iterations = (end - start) / delta;

    // one iteration is the minimum
    iterations = iterations || 1;
    assert(iterations >= 0);

    for (var i = 0; i <= iterations; i += 1) {
      var x = start + delta * i;
      var y = meta.fn(x);
      if (utils.isValidNumber(x) && utils.isValidNumber(y)) {
        data.push([x, y]);
      }
    }

    data = this.split(data, meta.graphOptions);
    return data;
  },

  split: function (data, options) {
    options = options || {};
    var EPS = 0.001;
    var limits = Array.prototype.slice.call(options.limits || []);
    var sets = [];
    var i = 0, j = 1;
    var singleSet = [];

    limits.unshift(-1e8);
    limits.push(1e8);
    while (i < data.length) {
      // cycle till a point is inside the range
      while (i < data.length && data[i][0] < limits[j - 1] + EPS) {
        ++i;
      }

      singleSet = [];
      while (i < data.length && data[i][0] >= limits[j - 1] + EPS && data[i][0] <= limits[j] - EPS) {
        singleSet.push(data[i++]);
      }

      ++j;
      if (singleSet.length) {
        sets.push(singleSet);
      }
    }
    return sets;
  }
};
