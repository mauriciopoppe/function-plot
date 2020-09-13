/**
 * Created by mauricio on 5/14/15.
 */
'use strict'
var intervalArithmeticEval = require('interval-arithmetic-eval')
var Interval = intervalArithmeticEval.Interval

var evaluate = require('../helpers/eval').interval
var utils = require('../utils')

// disable the use of typed arrays in interval-arithmetic to improve the performance
intervalArithmeticEval.policies.disableRounding()

function interval1d (chart, meta, range, nSamples) {
  var xCoords = utils.space(chart, range, nSamples)
  var xScale = chart.meta.xScale
  var yScale = chart.meta.yScale
  var yMin = yScale.domain()[0]
  var yMax = yScale.domain()[1]
  var samples = []
  var i
  for (i = 0; i < xCoords.length - 1; i += 1) {
    var x = { lo: xCoords[i], hi: xCoords[i + 1] }
    var y = evaluate(meta, 'fn', { x: x })
    if (!Interval.isEmpty(y) && !Interval.isWhole(y)) {
      samples.push([x, y])
    }
    if (Interval.isWhole(y)) {
      // means that the next and prev intervals need to be fixed
      samples.push(null)
    }
  }

  // asymptote determination
  for (i = 1; i < samples.length - 1; i += 1) {
    if (!samples[i]) {
      var prev = samples[i - 1]
      var next = samples[i + 1]
      if (prev && next && !Interval.intervalsOverlap(prev[1], next[1])) {
        // case:
        //
        //   |
        //
        //     |
        //
        //   p n
        if (prev[1].lo > next[1].hi) {
          prev[1].hi = Math.max(yMax, prev[1].hi)
          next[1].lo = Math.min(yMin, next[1].lo)
        }
        // case:
        //
        //     |
        //
        //   |
        //
        //   p n
        if (prev[1].hi < next[1].lo) {
          prev[1].lo = Math.min(yMin, prev[1].lo)
          next[1].hi = Math.max(yMax, next[1].hi)
        }
      }
    }
  }

  samples.scaledDx = xScale(xCoords[1]) - xScale(xCoords[0])
  return [samples]
}

var rectEps
function smallRect (x, y) {
  return Interval.width(x) < rectEps
}

function quadTree (x, y, meta) {
  var sample = evaluate(meta, 'fn', {
    x: x,
    y: y
  })
  var fulfills = Interval.zeroIn(sample)
  if (!fulfills) { return this }
  if (smallRect(x, y)) {
    this.push([x, y])
    return this
  }
  var midX = x.lo + (x.hi - x.lo) / 2
  var midY = y.lo + (y.hi - y.lo) / 2
  var east = { lo: midX, hi: x.hi }
  var west = { lo: x.lo, hi: midX }
  var north = { lo: midY, hi: y.hi }
  var south = { lo: y.lo, hi: midY }

  quadTree.call(this, east, north, meta)
  quadTree.call(this, east, south, meta)
  quadTree.call(this, west, north, meta)
  quadTree.call(this, west, south, meta)
}

function interval2d (chart, meta) {
  var xScale = chart.meta.xScale
  var xDomain = chart.meta.xScale.domain()
  var yDomain = chart.meta.yScale.domain()
  var x = { lo: xDomain[0], hi: xDomain[1] }
  var y = { lo: yDomain[0], hi: yDomain[1] }
  var samples = []
  // 1 px
  rectEps = xScale.invert(1) - xScale.invert(0)
  quadTree.call(samples, x, y, meta)
  samples.scaledDx = 1
  return [samples]
}

var sampler = function (chart, d, range, nSamples) {
  var fnTypes = {
    implicit: interval2d,
    linear: interval1d
  }
  if (!(fnTypes.hasOwnProperty(d.fnType))) {
    throw Error(d.fnType + ' is not supported in the `interval` sampler')
  }
  return fnTypes[d.fnType].apply(null, arguments)
}

module.exports = sampler
