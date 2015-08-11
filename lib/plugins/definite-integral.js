var d3 = window.d3
var extend = require('extend')
var pressed = require('key-pressed')
var keydown = require('keydown')
var integrateSimpson = require('integrate-adaptive-simpson')
module.exports = function (options) {
  options = extend({
    key: '<shift>'
  }, options)

  var brush = d3.svg.brush()
  var kd = keydown(options.key)

  // the integrator module requires a function with a single parameter x
  function wrapper (datum) {
    return function (x) {
      var functionPlot = window.functionPlot
      return functionPlot.eval.builtIn(datum, 'fn', {x: x})
    }
  }

  function inner (instance) {
    // update the brush scale with the instance scale
    var oldDisableZoom
    brush
      .x(instance.meta.xScale)
      .on('brushstart', function () {
        if (!d3.event.sourceEvent) return
        oldDisableZoom = !!instance.options.disableZoom
        instance.options.disableZoom = true
        // replot the samples with the option disableZoom set to true
        instance.emit('draw')
      })
      .on('brushend', function () {
        if (!d3.event.sourceEvent) return
        instance.options.disableZoom = oldDisableZoom

        if (!brush.empty()) {
          var a = brush.extent()[0]
          var b = brush.extent()[1]
          // iterate the data finding the value of the definite integral
          // with bounds `a` and `b`
          instance.options.data.forEach(function (datum, i) {
            var value = integrateSimpson(wrapper(datum), a, b, options.tol, options.maxdepth)
            instance.emit('definite-integral', datum, i, value, a, b)
          })
        }
        // replot the samples with the option disableZoom set to whatever it was before
        instance.emit('draw')
      })
    var brushEl = instance.canvas.append('g').attr('class', 'brush')
    brushEl
      .call(brush)
      .call(brush.event)

    instance.canvas.selectAll('.brush .extent')
      .attr('stroke', '#fff')
      .attr('fill-opacity', 0.125)
      .attr('shape-rendering', 'crispEdges')

    brushEl.selectAll('rect')
      .attr('height', instance.meta.height)
    function setBrushState (state) {
      brushEl
        .style('display', state ? null : 'none')
    }
    // initially the brush is disabled and it's enabled on keydown
    setBrushState(false)

    instance.canvas
      .on('mousemove.definiteIntegral', function () {
        setBrushState(pressed(options.key))
      })
    kd.on('pressed', function () {
      setBrushState(true)
    })
  }

  return inner
}
