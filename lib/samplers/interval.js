/**
 * Created by mauricio on 5/14/15.
 */
'use strict';
var compile = require('interval-arithmetic-eval');
var extend = require('extend');

// disable the use of typed arrays in interval-arithmetic to improve the performance
compile.policies.disableRounding();

var sampler = function (chart, meta, allX) {
  var code;
  var xScale = chart.meta.xScale;
  var yScale = chart.meta.yScale;
  var yMin = yScale.domain()[0];
  var yMax = yScale.domain()[1];

  /* eslint-disable */
  // compile the function using interval arithmetic, cache the result
  // so that multiple calls with the same argument don't trigger the
  // compilation process
  if (meta.fn !== meta._intervalExpression) {
    meta._intervalExpression = meta.fn;
    meta._intervalFn = compile(meta.fn);
  }
  code = meta._intervalFn;
  /* eslint-enable */

  var samples = [];
  var i;
  for (i = 0; i < allX.length - 1; i += 1) {
    var x = {lo: allX[i], hi: allX[i + 1]};
    var y = code.eval(
      extend({x: x}, meta.scope)
    );
    if (!compile.Interval.empty(y) && !compile.Interval.whole(y)) {
      samples.push([x, y]);
    }
    if (compile.Interval.whole(y)) {
      // means that the next and prev intervals need to be fixed
      samples.push(null);
    }
  }

  // asymptote determination
  for (i = 1; i < samples.length - 1; i += 1) {
    if (!samples[i]) {
      var prev = samples[i - 1];
      var next = samples[i + 1];
      if (prev && next && !compile.Interval.overlap(prev[1], next[1])) {
        if (prev[1].lo > next[1].hi) {
          prev[1].hi = Math.max(yMax, prev[1].hi);
          next[1].lo = Math.min(yMin, next[1].lo);
        }
        if (prev[1].hi < next[1].lo) {
          prev[1].lo = Math.min(yMin, prev[1].lo);
          next[1].hi = Math.max(yMax, next[1].hi);
        }
      }
    }
  }

  // transform infinite to the limit
  for (i = 0; i < samples.length; i += 1) {
    if (samples[i]) {
      if (!isFinite(samples[i][1].lo)) {
        samples[i][1].lo = yMin;
      }
      if (!isFinite(samples[i][1].hi)) {
        samples[i][1].hi = yMax;
      }
    }
  }

  samples.dx = xScale(allX[1]) - xScale(allX[0]);
  return [samples];
};

module.exports = sampler;
