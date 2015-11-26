/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var d3 = window.d3

module.exports = function (options) {
  var annotations
  var xScale = options.owner.meta.xScale
  var yScale = options.owner.meta.yScale

  var line = d3.svg.line()
    .x(function (d) { return d[0] })
    .y(function (d) { return d[1] })

  annotations = function (parentSelection) {
    parentSelection.each(function () {
      // join
      var current = d3.select(this)
      var selection = current.selectAll('g.annotations')
        .data(function (d) { return d.annotations || [] })

      // enter
      selection.enter()
        .append('g')
        .attr('class', 'annotations')

      // enter + update
      // - path
      var yRange = yScale.range()
      var xRange = xScale.range()
      var path = selection.selectAll('path')
        .data(function (d) {
          if (d.hasOwnProperty('x')) {
            return [ [[0, yRange[0]], [0, yRange[1]]] ]
          } else {
            return [ [[xRange[0], 0], [xRange[1], 0]] ]
          }
        })
      path.enter()
        .append('path')
        .attr('stroke', '#eee')
        .attr('d', line)
      path.exit().remove()

      // enter + update
      // - text
      var text = selection.selectAll('text')
        .data(function (d) {
          return [{
            text: d.text || '',
            hasX: d.hasOwnProperty('x')
          }]
        })
      text.enter()
        .append('text')
        .attr('y', function (d) {
          return d.hasX ? 3 : 0
        })
        .attr('x', function (d) {
          return d.hasX ? 0 : 3
        })
        .attr('dy', function (d) {
          return d.hasX ? 5 : -5
        })
        .attr('text-anchor', function (d) {
          return d.hasX ? 'end' : ''
        })
        .attr('transform', function (d) {
          return d.hasX ? 'rotate(-90)' : ''
        })
        .text(function (d) { return d.text })
      text.exit().remove()

      // enter + update
      // move group
      selection
        .attr('transform', function (d) {
          if (d.hasOwnProperty('x')) {
            return 'translate(' + xScale(d.x) + ', 0)'
          } else {
            return 'translate(0, ' + yScale(d.y) + ')'
          }
        })

      // exit
      selection.exit()
        .remove()
    })
  }

  return annotations
}
