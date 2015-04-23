/**
 * Created by mauricio on 3/29/15.
 */
'use strict';

var utils = require('./utils');
var Const = require('./constants');
var assert = utils.assert;
module.exports = {
  range: function (chart, meta) {
    var range = meta.range || [-Infinity, Infinity];
    var scale = chart.meta.xScale;
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

    var samples = meta.samples || 100;
    var delta = meta.deltaX;
    if (!delta) {
      delta = (end - start) / samples;
    }

    var iterations = (end - start) / delta;

    // one iteration is the minimum
    iterations = iterations || 1;
    assert(iterations >= 0);

    // limit delta to avoid struggling
    if (iterations > Const.MAX_ITERATIONS) {
      console.warn('too many iterations, limited to Const.MAX_ITERATIONS =', Const.MAX_ITERATIONS);
      iterations = Const.MAX_ITERATIONS;
      delta = (end - start) / iterations;
    }

    for (var i = 0; i <= iterations; i += 1) {
      var x = start + delta * i;
      var y = meta.fn(x);
      if (utils.isValidNumber(x) && utils.isValidNumber(y)) {
        data.push([x, y]);
      }
    }

    data = this.split(chart, data, meta.graphOptions);
    return data;
  },

  split: function (chart, data) {
    var i, oldSign, st = [];
    var sets = [];
    var domain = chart.meta.yScale.domain();
    var yMin = domain[0];
    var yMax = domain[1];

    i = 1;
    oldSign = 0;

    if (data[0]) {
      st.push(data[0]);
    }

    while (i < data.length) {
      var y0 = data[i - 1][1];
      var y1 = data[i][1];
      var x1 = data[i][0];
      var diff = y1 - y0;
      var newSign = utils.sgn(diff);
      // TODO: adjust the hardcoded number
      if (utils.sgn(y0) * utils.sgn(y1) < 0 && oldSign !== newSign && Math.abs(diff) > 5) {
        st.push([x1, oldSign > 0 ? yMax : yMin]);
        sets.push(st);
        st = [ [x1, newSign > 0 ? yMax : yMin] ];
      }
      st.push(data[i]);
      oldSign = newSign;
      ++i;
    }

    if (st.length) {
      sets.push(st);
    }

    return sets;
  }
};
