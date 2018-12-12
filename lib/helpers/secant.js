/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var d3 = window.d3

var extend = require('extend')
var builtInEvaluator = require('./eval').builtIn
var datumDefaults = require('../datum-defaults')
var polyline = require('../graph-types/polyline')

module.exports = function (chart) {
  var secantDefaults = datumDefaults({
    isHelper: true,
    skipTip: true,
    skipBoundsCheck: true,
    nSamples: 2,
    graphType: 'polyline'
  })
  var secant

  function computeSlope (scope) {
    scope.m = (scope.y1 - scope.y0) / (scope.x1 - scope.x0)
  }

  function updateLine (d, secant) {
    if (!secant.hasOwnProperty('x0')) {
      throw Error('secant must have the property `x0` defined')
    }
    secant.scope = secant.scope || {}

    var x0 = secant.x0
    var x1 = typeof secant.x1 === 'number' ? secant.x1 : Infinity
    extend(secant.scope, {
      x0: x0,
      x1: x1,
      y0: builtInEvaluator(d, 'fn', { x: x0 }),
      y1: builtInEvaluator(d, 'fn', { x: x1 })
    })
    computeSlope(secant.scope)
  }

  function setFn (d, secant) {
    updateLine(d, secant)
    secant.fn = 'm * (x - x0) + y0'
  }

  function setMouseListener (d, secantObject) {
    var self = this
    if (secantObject.updateOnMouseMove && !secantObject.$$mouseListener) {
      secantObject.$$mouseListener = function (x1) {
        secantObject.x1 = x1
        updateLine(d, secantObject)
        secant(self)
      }
      chart.on('tip:update', secantObject.$$mouseListener)
    }
  }

  function computeLines (d) {
    var self = this
    var data = []
    d.secants = d.secants || []
    for (var i = 0; i < d.secants.length; i += 1) {
      var secant = d.secants[i] = extend({}, secantDefaults, d.secants[i])
      // necessary to make the secant have the same color as d
      secant.index = d.index
      if (!secant.fn) {
        setFn.call(self, d, secant)
        setMouseListener.call(self, d, secant)
      }
      data.push(secant)
    }
    return data
  }

  secant = function (selection) {
    selection.each(function (d) {
      var el = d3.select(this)
      var data = computeLines.call(selection, d)
      var innerSelection = el.selectAll('g.secant')
        .data(data)

      innerSelection.enter()
        .append('g')
        .attr('class', 'secant')

      // enter + update
      innerSelection
        .call(polyline(chart))

      // change the opacity of the secants
      innerSelection.selectAll('path')
        .attr('opacity', 0.5)

      // exit
      innerSelection.exit().remove()
    })
  }

  return secant
}
