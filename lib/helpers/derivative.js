/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var d3 = window.d3
var builtInEvaluator = require('./eval').builtIn
var polyline = require('../graph-types/polyline')
var datumDefaults = require('../datum-defaults')

module.exports = function (chart) {
  var derivativeDatum = datumDefaults({
    isHelper: true,
    skipTip: true,
    skipBoundsCheck: true,
    nSamples: 2,
    graphType: 'polyline'
  })
  var derivative

  function computeLine (d) {
    if (!d.derivative) {
      return []
    }
    var x0 = typeof d.derivative.x0 === 'number' ? d.derivative.x0 : Infinity
    derivativeDatum.index = d.index
    derivativeDatum.scope = {
      m: builtInEvaluator(d.derivative, 'fn', { x: x0 }),
      x0: x0,
      y0: builtInEvaluator(d, 'fn', { x: x0 })
    }
    derivativeDatum.fn = 'm * (x - x0) + y0'
    return [derivativeDatum]
  }

  function checkAutoUpdate (d) {
    var self = this
    if (!d.derivative) {
      return
    }
    if (d.derivative.updateOnMouseMove && !d.derivative.$$mouseListener) {
      d.derivative.$$mouseListener = function (x0) {
        // update initial value to be the position of the mouse
        // scope's x0 will be updated on the next call to `derivative(self)`
        if (d.derivative) {
          d.derivative.x0 = x0
        }
        // trigger update (selection = self)
        derivative(self)
      }
      // if d.derivative is destroyed and recreated, the tip:update event
      // will be fired on the new d.derivative :)
      chart.on('tip:update', d.derivative.$$mouseListener)
    }
  }

  derivative = function (selection) {
    selection.each(function (d) {
      var el = d3.select(this)
      var data = computeLine.call(selection, d)
      checkAutoUpdate.call(selection, d)
      var innerSelection = el.selectAll('g.derivative')
        .data(data)

      innerSelection.enter()
        .append('g')
        .attr('class', 'derivative')

      // enter + update
      innerSelection
        .call(polyline(chart))

      // update
      // change the opacity of the line
      innerSelection.selectAll('path')
        .attr('opacity', 0.5)

      innerSelection.exit().remove()
    })
  }

  return derivative
}
