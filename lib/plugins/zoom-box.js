var d3 = window.d3
var extend = require('extend')
var pressed = require('key-pressed')
var keydown = require('keydown')
module.exports = function (options) {
  options = extend({
    keydown: '<shift>'
  })

  var brush = d3.svg.brush()
  var kd = keydown(options.keydown)

  function inner (instance) {
    // update the brush scale with the instance scale
    var oldDisableZoom
    brush
      .x(instance.meta.xScale)
      .y(instance.meta.yScale)
      .on('brushstart', function () {
        if (!d3.event.sourceEvent) return
        oldDisableZoom = !!instance.options.disableZoom
        instance.options.disableZoom = true
        instance.emit('draw')
      })
      .on('brushend', function () {
        if (!d3.event.sourceEvent) return
        instance.options.disableZoom = oldDisableZoom

        if (!brush.empty()) {
          var lo = brush.extent()[0]
          var hi = brush.extent()[1]
          var x = [lo[0], hi[0]]
          var y = [lo[1], hi[1]]
          var xScale = instance.meta.xScale
          var yScale = instance.meta.yScale
          var zoomBehavior = instance.meta.zoomBehavior
          d3.transition()
            .duration(750)
            .tween('zoom', function () {
              var ix = d3.interpolate(xScale.domain(), x)
              var iy = d3.interpolate(yScale.domain(), y)
              return function (t) {
                zoomBehavior
                  .x(xScale.domain(ix(t)))
                  .y(yScale.domain(iy(t)))
                instance.updateAxes()
                instance.emit('draw')
              }
            })
            .each('end', function () {
            })
        }
        d3.select(this)
          .transition()
          .duration(1)
          .call(brush.clear())
          .call(brush.event)
      })
    var brushEl = instance.canvas.append('g').attr('class', 'brush')
    brushEl
      .call(brush)
      .call(brush.event)

    instance.canvas.selectAll('.brush .extent')
      .attr('stroke', '#fff')
      .attr('fill-opacity', 0.125)
      .attr('shape-rendering', 'crispEdges')

    function setBrushState (state) {
      brushEl
        .selectAll('.background')
        .style('display', state ? null : 'none')
    }
    setBrushState(false)
    // initially the brush is disabled and it's enabled on keydown
    var over = false
    instance.canvas
      .on('mouseover.zoombox', function () { over = true })
      .on('mousemove.zoombox', function () {
        setBrushState(pressed(options.keydown))
      })
      .on('mouseout.zoombox', function () { over = false })
    kd.on('pressed', function () {
      if (over) {
        setBrushState(true)
      }
    })
  }

  return inner
}
