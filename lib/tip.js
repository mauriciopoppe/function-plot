/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var d3 = window.d3
var extend = require('extend')
var utils = require('./utils')
var clamp = require('clamp')
var globals = require('./globals')
var builtInEvaluator = require('./helpers/eval').builtIn

module.exports = function (config) {
  config = extend({
    xLine: false,
    yLine: false,
    renderer: function (x, y, index) {
      return '(' + x.toFixed(3) + ', ' + y.toFixed(3) + ')'
    },
    owner: null
  }, config)

  var MARGIN = 20

  var line = d3.svg.line()
    .x(function (d) { return d[0] })
    .y(function (d) { return d[1] })

  function lineGenerator (el, data) {
    return el.append('path')
      .datum(data)
      .attr('stroke', 'grey')
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.5)
      .attr('d', line)
  }

  function tip (selection) {
    var innerSelection = selection.selectAll('g.tip')
      .data(function (d) { return [d] })

    // enter
    innerSelection
      .enter().append('g')
      .attr('class', 'tip')
      .attr('clip-path', 'url(#function-plot-clip-' + config.owner.id + ')')

    // enter + update = enter inner tip
    tip.el = innerSelection.selectAll('g.inner-tip')
      .data(function (d) {
        // debugger
        return [d]
      })

    tip.el.enter()
      .append('g')
      .attr('class', 'inner-tip')
      .style('display', 'none')
      .each(function () {
        var el = d3.select(this)
        lineGenerator(el, [[0, -config.owner.meta.height - MARGIN], [0, config.owner.meta.height + MARGIN]])
          .attr('class', 'tip-x-line')
          .style('display', 'none')
        lineGenerator(el, [[-config.owner.meta.width - MARGIN, 0], [config.owner.meta.width + MARGIN, 0]])
          .attr('class', 'tip-y-line')
          .style('display', 'none')
        el.append('circle').attr('r', 3)
        el.append('text').attr('transform', 'translate(5,-5)')
      })

    // enter + update
    selection.selectAll('.tip-x-line').style('display', config.xLine ? null : 'none')
    selection.selectAll('.tip-y-line').style('display', config.yLine ? null : 'none')
  }

  tip.move = function (coordinates) {
    var i
    var minDist = Infinity
    var closestIndex = -1
    var x, y

    var el = tip.el
    var inf = 1e8
    var meta = config.owner.meta
    var data = el.data()[0].data
    var xScale = meta.xScale
    var yScale = meta.yScale
    var width = meta.width
    var height = meta.height

    var x0 = coordinates.x
    var y0 = coordinates.y

    for (i = 0; i < data.length; i += 1) {
      // skipTip=true skips the evaluation in the datum
      // implicit equations cannot be evaluated with a single point
      // parametric equations cannot be evaluated with a single point
      // polar equations cannot be evaluated with a single point
      if (data[i].skipTip || data[i].fnType !== 'linear') {
        continue
      }

      var range = data[i].range || [-inf, inf]
      if (x0 > range[0] - globals.TIP_X_EPS && x0 < range[1] + globals.TIP_X_EPS) {
        try {
          var candidateY = builtInEvaluator(data[i], 'fn', { x: x0 })
        } catch (e) { }
        if (utils.isValidNumber(candidateY)) {
          var tDist = Math.abs(candidateY - y0)
          if (tDist < minDist) {
            minDist = tDist
            closestIndex = i
          }
        }
      }
    }

    if (closestIndex !== -1) {
      x = x0
      if (data[closestIndex].range) {
        x = Math.max(x, data[closestIndex].range[0])
        x = Math.min(x, data[closestIndex].range[1])
      }
      y = builtInEvaluator(data[closestIndex], 'fn', { x: x })

      tip.show()
      config.owner.emit('tip:update', x, y, closestIndex)
      var clampX = clamp(x, xScale.invert(-MARGIN), xScale.invert(width + MARGIN))
      var clampY = clamp(y, yScale.invert(height + MARGIN), yScale.invert(-MARGIN))
      var color = utils.color(data[closestIndex], closestIndex)
      el.attr('transform', 'translate(' + xScale(clampX) + ',' + yScale(clampY) + ')')
      el.select('circle')
        .attr('fill', color)
      el.select('text')
        .attr('fill', color)
        .text(config.renderer(x, y, closestIndex))
    } else {
      tip.hide()
    }
  }

  tip.show = function () {
    this.el.style('display', null)
  }

  tip.hide = function () {
    this.el.style('display', 'none')
  }
  // generations of getters/setters
  Object.keys(config).forEach(function (option) {
    utils.getterSetter.call(tip, config, option)
  })

  return tip
}
