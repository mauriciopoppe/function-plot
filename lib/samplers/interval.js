/**
 * Created by mauricio on 5/14/15.
 */
'use strict';
var compile = require('interval-arithmetic-eval');
var Interval = compile.Interval;
var extend = require('extend');

var utils = require('../utils');

// disable the use of typed arrays in interval-arithmetic to improve the performance
compile.policies.disableRounding();

function check(meta) {
  /* eslint-disable */
  // compile the function using interval arithmetic, cache the result
  // so that multiple calls with the same argument don't trigger the
  // compilation process
  if (meta.fn !== meta._intervalExpression) {
    meta._intervalExpression = meta.fn;
    meta._intervalFn = compile(meta.fn);
  }
  meta.scope = meta.scope || {};
  /* eslint-enable */
}

function evaluate(meta, variables) {
  check(meta);
  /* eslint-disable */
  var compiled = meta._intervalFn;
  /* eslint-enable */
  return compiled.eval(
    extend({}, meta.scope, variables)
  );
}

function interval1d(chart, meta, allX) {
  var xScale = chart.meta.xScale;
  var yScale = chart.meta.yScale;
  var yMin = yScale.domain()[0];
  var yMax = yScale.domain()[1];
  var samples = [];
  var i;
  for (i = 0; i < allX.length - 1; i += 1) {
    var x = {lo: allX[i], hi: allX[i + 1]};
    var y = evaluate(meta, {x: x});
    if (!Interval.empty(y) && !Interval.whole(y)) {
      samples.push([x, y]);
    }
    if (Interval.whole(y)) {
      // means that the next and prev intervals need to be fixed
      samples.push(null);
    }
  }

  // asymptote determination
  for (i = 1; i < samples.length - 1; i += 1) {
    if (!samples[i]) {
      var prev = samples[i - 1];
      var next = samples[i + 1];
      if (prev && next && !Interval.overlap(prev[1], next[1])) {
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

  samples.scaledDx = xScale(allX[1]) - xScale(allX[0]);
  return [samples];
}

var rectEps;
function smallRect(x, y) {
  return Interval.width(x) < rectEps;
}

function quadTree(x, y, meta) {
  var sample = evaluate(meta, {
    x: x,
    y: y
  });
  var fulfills = Interval.zeroIn(sample);
  if (!fulfills) { return this; }
  if (smallRect(x, y)) {
    this.push([x, y]);
    return this;
  }
  var midX = x.lo + (x.hi - x.lo) / 2;
  var midY = y.lo + (y.hi - y.lo) / 2;
  var east = {lo: midX, hi: x.hi};
  var west = {lo: x.lo, hi: midX};
  var north = {lo: midY, hi: y.hi};
  var south = {lo: y.lo, hi: midY};

  quadTree.call(this, east, north, meta);
  quadTree.call(this, east, south, meta);
  quadTree.call(this, west, north, meta);
  quadTree.call(this, west, south, meta);
}

function interval2d(chart, meta, range, n) {
  var xScale = chart.meta.xScale;
  var xDomain = chart.meta.xScale.domain();
  var yDomain = chart.meta.yScale.domain();
  var x = {lo: xDomain[0], hi: xDomain[1]};
  var y = {lo: yDomain[0], hi: yDomain[1]};
  var samples = [];
  // 1 px
  rectEps = xScale.invert(1) - xScale.invert(0);
  quadTree.call(samples, x, y, meta);
  samples.scaledDx = 1;
  return [samples];
}

var sampler = function (chart, meta, range, samples) {
  if (meta.implicit) {
    return interval2d.apply(null, arguments);
  } else {
    return interval1d.call(null, chart, meta, utils.linspace(range, samples));
  }
};

module.exports = sampler;
