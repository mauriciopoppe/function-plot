/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var d3 = window.d3
var evaluate = require('../evaluate')
var utils = require('../utils')

module.exports = function (chart) {
  var minWidthHeight
  var xScale = chart.meta.xScale
  var yScale = chart.meta.yScale

  function clampRange (vLo, vHi, gLo, gHi) {
    // issue 69
    // by adding the option `invert` to both the xAxis and the `yAxis`
    // it might be possible that after the transformation to canvas space
    // the y limits of the rectangle get inverted i.e. gLo > gHi
    //
    // e.g.
    //
    //   functionPlot({
    //     target: '#playground',
    //     yAxis: { invert: true },
    //     // ...
    //   })
    //
    if (gLo > gHi) {
      var t = gLo
      gLo = gHi
      gHi = t
    }
    var hi = Math.min(vHi, gHi)
    var lo = Math.max(vLo, gLo)
    if (lo > hi) {
      // no overlap
      return [-minWidthHeight, 0]
    }
    return [lo, hi]
  }

  var line = function (points, closed) {
    var path = ''
    var range = yScale.range()
    var minY = Math.min.apply(Math, range)
    var maxY = Math.max.apply(Math, range)
    for (var i = 0, length = points.length; i < length; i += 1) {
      if (points[i]) {
        var x = points[i][0]
        var y = points[i][1]
        var yLo = y.lo
        var yHi = y.hi
        // if options.closed is set to true then one of the bounds must be zero
        if (closed) {
          yLo = Math.min(yLo, 0)
          yHi = Math.max(yHi, 0)
        }
        // points.scaledDX is added because of the stroke-width
        var moveX = xScale(x.lo) + points.scaledDx / 2
        var viewportY = clampRange(
          minY, maxY,
          isFinite(yHi) ? yScale(yHi) : -Infinity,
          isFinite(yLo) ? yScale(yLo) : Infinity
        )
        var vLo = viewportY[0]
        var vHi = viewportY[1]
        path += ' M ' + moveX + ' ' + vLo
        path += ' v ' + Math.max(vHi - vLo, minWidthHeight)
      }
    }
    return path
  }

  function plotLine (selection) {
    selection.each(function (d) {
      var el = plotLine.el = d3.select(this)
      var index = d.index
      var closed = d.closed
      var evaluatedData = evaluate(chart, d)
      var innerSelection = el.selectAll(':scope > path.line')
        .data(evaluatedData)

      // the min height/width of the rects drawn by the path generator
      minWidthHeight = Math.max(evaluatedData[0].scaledDx, 1)

      innerSelection.enter()
        .append('path')
        .attr('class', 'line line-' + index)
        .attr('fill', 'none')

      // enter + update
      innerSelection
        .attr('stroke-width', minWidthHeight)
        .attr('stroke', utils.color(d, index))
        .attr('opacity', closed ? 0.5 : 1)
        .attr('d', function (d) {
          return line(d, closed)
        })
        .attr(d.attr)

      innerSelection.exit().remove()
    })
  }

  return plotLine
}
