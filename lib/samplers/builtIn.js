'use strict'
var clamp = require('clamp')
var linspace = require('linspace')

var utils = require('../utils')
var evaluate = require('../helpers/eval').builtIn

function checkAsymptote (d0, d1, meta, sign, level) {
  if (!level) {
    return {
      asymptote: true,
      d0: d0,
      d1: d1
    }
  }
  var i
  var n = 10
  var x0 = d0[0]
  var x1 = d1[0]
  var samples = linspace(x0, x1, n)
  var oldY, oldX
  for (i = 0; i < n; i += 1) {
    var x = samples[i]
    var y = evaluate(meta, 'fn', { x: x })

    if (i) {
      var deltaY = y - oldY
      var newSign = utils.sgn(deltaY)
      if (newSign === sign) {
        return checkAsymptote([oldX, oldY], [x, y], meta, sign, level - 1)
      }
    }
    oldY = y
    oldX = x
  }
  return {
    asymptote: false,
    d0: d0,
    d1: d1
  }
}

/**
 * Splits the evaluated data into arrays, each array is separated by any asymptote found
 * through the process of detecting slope/sign brusque changes
 * @param chart
 * @param data
 * @returns {Array[]}
 */
function split (chart, meta, data) {
  var i, oldSign
  var deltaX
  var st = []
  var sets = []
  var domain = chart.meta.yScale.domain()
  var zoomScale = chart.meta.zoomBehavior.scale()
  var yMin = domain[0]
  var yMax = domain[1]

  if (data[0]) {
    st.push(data[0])
    deltaX = data[1][0] - data[0][0]
    oldSign = utils.sgn(data[1][1] - data[0][1])
  }

  function updateY (d) {
    d[1] = Math.min(d[1], yMax)
    d[1] = Math.max(d[1], yMin)
    return d
  }

  i = 1
  while (i < data.length) {
    var y0 = data[i - 1][1]
    var y1 = data[i][1]
    var deltaY = y1 - y0
    var newSign = utils.sgn(deltaY)
    // make a new set if:
    if (// utils.sgn(y1) * utils.sgn(y0) < 0 && // there's a change in the evaluated values sign
      // there's a change in the slope sign
      oldSign !== newSign &&
      // the slope is bigger to some value (according to the current zoom scale)
      Math.abs(deltaY / deltaX) > 1 / zoomScale) {
      // retest this section again and determine if it's an asymptote
      var check = checkAsymptote(data[i - 1], data[i], meta, newSign, 3)
      if (check.asymptote) {
        st.push(updateY(check.d0))
        sets.push(st)
        st = [updateY(check.d1)]
      }
    }
    oldSign = newSign
    st.push(data[i])
    ++i
  }

  if (st.length) {
    sets.push(st)
  }

  return sets
}

function linear (chart, meta, range, n) {
  var allX = utils.space(chart, range, n)
  var yDomain = chart.meta.yScale.domain()
  var yDomainMargin = (yDomain[1] - yDomain[0])
  var yMin = yDomain[0] - yDomainMargin * 1e5
  var yMax = yDomain[1] + yDomainMargin * 1e5
  var data = []
  var i
  for (i = 0; i < allX.length; i += 1) {
    var x = allX[i]
    var y = evaluate(meta, 'fn', { x: x })
    if (utils.isValidNumber(x) && utils.isValidNumber(y)) {
      data.push([x, clamp(y, yMin, yMax)])
    }
  }
  data = split(chart, meta, data)
  return data
}

function parametric (chart, meta, range, nSamples) {
  // range is mapped to canvas coordinates from the input
  // for parametric plots the range will tell the start/end points of the `t` param
  var parametricRange = meta.range || [0, 2 * Math.PI]
  var tCoords = utils.space(chart, parametricRange, nSamples)
  var samples = []
  for (var i = 0; i < tCoords.length; i += 1) {
    var t = tCoords[i]
    var x = evaluate(meta, 'x', { t: t })
    var y = evaluate(meta, 'y', { t: t })
    samples.push([x, y])
  }
  return [samples]
}

function polar (chart, meta, range, nSamples) {
  // range is mapped to canvas coordinates from the input
  // for polar plots the range will tell the start/end points of the `theta` param
  var polarRange = meta.range || [-Math.PI, Math.PI]
  var thetaSamples = utils.space(chart, polarRange, nSamples)
  var samples = []
  for (var i = 0; i < thetaSamples.length; i += 1) {
    var theta = thetaSamples[i]
    var r = evaluate(meta, 'r', { theta: theta })
    var x = r * Math.cos(theta)
    var y = r * Math.sin(theta)
    samples.push([x, y])
  }
  return [samples]
}

function points (chart, meta, range, nSamples) {
  return [meta.points]
}

function vector (chart, meta, range, nSamples) {
  meta.offset = meta.offset || [0, 0]
  return [[
    meta.offset,
    [meta.vector[0] + meta.offset[0], meta.vector[1] + meta.offset[1]]
  ]]
}

var sampler = function (chart, d, range, nSamples) {
  var fnTypes = {
    parametric: parametric,
    polar: polar,
    points: points,
    vector: vector,
    linear: linear
  }
  if (!(d.fnType in fnTypes)) {
    throw Error(d.fnType + ' is not supported in the `builtIn` sampler')
  }
  return fnTypes[d.fnType].apply(null, arguments)
}

module.exports = sampler
