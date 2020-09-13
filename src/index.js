/*
 * function-plot
 *
 * Copyright (c) 2015 Mauricio Poppe
 * Licensed under the MIT license.
 */
import { line as d3Line } from 'd3-shape'
import { format as d3Format } from 'd3-format'
import { scaleLinear as d3ScaleLinear, scaleLog as d3ScaleLog } from 'd3-scale'
import { axisLeft as d3AxisLeft, axisBottom as d3AxisBottom } from 'd3-axis'
import { zoom as d3Zoom } from 'd3-zoom'
import { select as d3Select } from 'd3-selection'

import annotations from './helpers/annotations'
import mousetip from './tip'

require('./polyfills')
const events = require('events')
const extend = require('extend')

// const mousetip = require('./tip')
const helpers = require('./helpers/')
// const annotations = require('./helpers/annotations')
const datumDefaults = require('./datum-defaults')
const globals = require('globals')
const graphTypes = require('./graph-types/')
const plugins = require('./plugins/')
const $eval = require('./helpers/eval')

const cache = []
const d3Scale = { linear: d3ScaleLinear, log: d3ScaleLog }

function functionPlot (options) {
  options = options || {}
  options.data = options.data || []

  // globals
  let width, height
  let margin
  let zoomBehavior
  let xScale, yScale
  const line = d3Line()
    .x(function (d) { return xScale(d[0]) })
    .y(function (d) { return yScale(d[1]) })

  function Chart () {
    const n = Math.random()
    const letter = String.fromCharCode(Math.floor(n * 26) + 97)
    this.id = options.id = letter + n.toString(16).substr(2)
    this.linkedGraphs = [this]
    this.options = options
    cache[this.id] = this
    this.setUpEventListeners()
  }

  Chart.prototype = Object.create(events.prototype)

  /**
   * Rebuilds the entire graph from scratch recomputing
   *
   * - the inner width/height
   * - scales/axes
   *
   * After this is done it does a complete redraw of all the datums,
   * if only the datums need to be redrawn call `instance.draw()` instead
   *
   * @returns {Chart}
   */
  Chart.prototype.build = function () {
    this.internalVars()
    this.drawGraphWrapper()
    return this
  }

  Chart.prototype.initializeAxes = function () {
    const integerFormat = d3Format('s')
    const format = function (scale) {
      return function (d) {
        const decimalFormat = scale.tickFormat(10)
        const isInteger = d === +d && d === (d | 0)
        // integers: d3.format('s'), see https://github.com/mbostock/d3/wiki/Formatting
        // decimals: default d3.scale.linear() formatting see
        //    https://github.com/mbostock/d3/blob/master/src/svg/axis.js#L29
        return isInteger ? integerFormat(d) : decimalFormat(d)
      }
    }

    function computeYScale (xScale) {
      // assumes that xScale is a linear scale
      const xDiff = xScale[1] - xScale[0]
      return height * xDiff / width
    }

    options.xAxis = options.xAxis || {}
    options.xAxis.type = options.xAxis.type || 'linear'

    options.yAxis = options.yAxis || {}
    options.yAxis.type = options.yAxis.type || 'linear'

    const xDomain = this.meta.xDomain = (function (axis) {
      if (axis.domain) {
        return axis.domain
      }
      if (axis.type === 'linear') {
        const xLimit = 12
        return [-xLimit / 2, xLimit / 2]
      } else if (axis.type === 'log') {
        return [1, 10]
      }
      throw Error('axis type ' + axis.type + ' unsupported')
    })(options.xAxis)

    const yDomain = this.meta.yDomain = (function (axis) {
      if (axis.domain) {
        return axis.domain
      }
      const yLimit = computeYScale(xDomain)
      if (axis.type === 'linear') {
        return [-yLimit / 2, yLimit / 2]
      } else if (axis.type === 'log') {
        return [1, 10]
      }
      throw Error('axis type ' + axis.type + ' unsupported')
    })(options.yAxis)

    if (xDomain[0] >= xDomain[1]) {
      throw Error('the pair defining the x-domain is inverted')
    }
    if (yDomain[0] >= yDomain[1]) {
      throw Error('the pair defining the y-domain is inverted')
    }

    xScale = this.meta.xScale = d3Scale[options.xAxis.type]()
      .domain(xDomain)
      .range(options.xAxis.invert ? [width, 0] : [0, width])
    yScale = this.meta.yScale = d3Scale[options.yAxis.type]()
      .domain(yDomain)
      .range(options.yAxis.invert ? [0, height] : [height, 0])
    this.meta.xAxis = d3AxisBottom()
      .scale(xScale)
      .tickSize(options.grid ? -height : 0)
      .tickFormat(format(xScale))

    this.meta.yAxis = d3AxisLeft()
      .scale(yScale)
      .tickSize(options.grid ? -width : 0)
      .tickFormat(format(yScale))
  }

  Chart.prototype.internalVars = function () {
    // measurements and other derived data
    this.meta = {}

    margin = this.meta.margin = { left: 30, right: 30, top: 20, bottom: 20 }
    // margin = this.meta.margin = {left: 0, right: 0, top: 20, bottom: 20}
    // if there's a title make the top margin bigger
    if (options.title) {
      this.meta.margin.top = 40
    }

    zoomBehavior = this.meta.zoomBehavior = d3Zoom()

    // inner width/height
    width = this.meta.width = (options.width || globals.DEFAULT_WIDTH) -
      margin.left - margin.right
    height = this.meta.height = (options.height || globals.DEFAULT_HEIGHT) -
      margin.top - margin.bottom

    this.initializeAxes()
  }

  Chart.prototype.drawGraphWrapper = function () {
    const root = this.root = d3Select(options.target).selectAll('svg')
      .data([options])

    // enter
    this.root.enter = root.enter()
      .append('svg')
      .attr('class', 'function-plot')
      .attr('font-size', this.getFontSize())

    // merge
    root
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)

    this.buildTitle()
    this.buildLegend()
    this.buildCanvas()
    this.buildClip()
    this.buildAxis()
    this.buildAxisLabel()

    // draw each datum after the wrapper was set up
    this.draw()

    // helper to detect the closest fn to the cursor's current abscissa
    const tip = this.tip = mousetip(extend(options.tip, { owner: this }))
    this.canvas
      .call(tip)

    this.buildZoomHelper()
    this.setUpPlugins()
  }

  Chart.prototype.buildTitle = function () {
    // join
    const selection = this.root.selectAll('text.title')
      .data(function (d) {
        return [d.title].filter(Boolean)
      })

    // enter
    selection.enter()
      .append('text')
      .attr('class', 'title')
      .attr('y', margin.top / 2)
      .attr('x', margin.left + width / 2)
      .attr('font-size', 25)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(options.title)

    // exit
    selection.exit().remove()
  }

  Chart.prototype.buildLegend = function () {
    // enter
    this.root.enter
      .append('text')
      .attr('class', 'top-right-legend')
      .attr('text-anchor', 'end')

    // update + enter
    this.root.select('.top-right-legend')
      .attr('y', margin.top / 2)
      .attr('x', width + margin.left)
  }

  Chart.prototype.buildCanvas = function () {
    const self = this

    this.meta.zoomBehavior
      // .x(xScale)
      // .y(yScale)
      .on('zoom', function onZoom (ev) {
        self.emit('all:zoom', ev.transform)
      })

    // enter
    const canvas = this.canvas = this.root
      .selectAll('.canvas')
      .data(function (d) { return [d] })

    this.canvas.enter = canvas.enter()
      .append('g')
      .attr('class', 'canvas')

    // enter + update
  }

  Chart.prototype.buildClip = function () {
    // (so that the functions don't overflow on zoom or drag)
    const id = this.id
    const defs = this.canvas.enter.append('defs')
    defs.append('clipPath')
      .attr('id', 'function-plot-clip-' + id)
      .append('rect')
      .attr('class', 'clip static-clip')

    // enter + update
    this.canvas.selectAll('.clip')
      .attr('width', width)
      .attr('height', height)

    // marker clip (for vectors)
    this.markerId = this.id + '-marker'
    defs.append('clipPath')
      .append('marker')
      .attr('id', this.markerId)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5L0,0')
      .attr('stroke-width', '0px')
      .attr('fill-opacity', 1)
      .attr('fill', '#777')
  }

  Chart.prototype.buildAxis = function () {
    // axis creation
    const canvasEnter = this.canvas.enter
    canvasEnter.append('g')
      .attr('class', 'x axis')
    canvasEnter.append('g')
      .attr('class', 'y axis')

    // update
    this.canvas.select('.x.axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(this.meta.xAxis)
    this.canvas.select('.y.axis')
      .call(this.meta.yAxis)
  }

  Chart.prototype.buildAxisLabel = function () {
    // axis labeling
    let xLabel, yLabel
    const canvas = this.canvas

    xLabel = canvas.selectAll('text.x.axis-label')
      .data(function (d) {
        return [d.xAxis.label].filter(Boolean)
      })
    xLabel.enter()
      .append('text')
      .attr('class', 'x axis-label')
      .attr('text-anchor', 'end')
    xLabel
      .attr('x', width)
      .attr('y', height - 6)
      .text(function (d) { return d })
    xLabel.exit().remove()

    yLabel = canvas.selectAll('text.y.axis-label')
      .data(function (d) {
        return [d.yAxis.label].filter(Boolean)
      })
    yLabel.enter()
      .append('text')
      .attr('class', 'y axis-label')
      .attr('y', 6)
      .attr('dy', '.75em')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-90)')
    yLabel
      .text(function (d) { return d })
    yLabel.exit().remove()
  }

  /**
   * @private
   *
   * Draws each of the datums stored in data.options, to do a full
   * redraw call `instance.draw()`
   */
  Chart.prototype.buildContent = function () {
    const self = this
    const canvas = this.canvas

    canvas
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoomBehavior)
      .each(function () {
        const el = d3Select(this)
        // make a copy of all the listeners available to be removed/added later
        const listeners = [
          'mousedown',
          'touchstart',
          ('onwheel' in document
            ? 'wheel' : 'ononmousewheel' in document
              ? 'mousewheel'
              : 'MozMousePixelScroll')
        ].map(function (d) { return d + '.zoom' })
        if (!el._zoomListenersCache) {
          listeners.forEach(function (l) {
            el['_' + l] = el.on(l)
          })
          el._zoomListenersCache = true
        }
        function setState (state) {
          listeners.forEach(function (l) {
            state ? el.on(l, el['_' + l]) : el.on(l, null)
          })
        }
        setState(!options.disableZoom)
      })

    const content = this.content = canvas.selectAll(':scope > g.content')
      .data(function (d) { return [d] })

    // g tag clipped to hold the data
    content.enter()
      .append('g')
      .attr('clip-path', 'url(#function-plot-clip-' + this.id + ')')
      .attr('class', 'content')

    // helper line, x = 0
    if (options.xAxis.type === 'linear') {
      const yOrigin = content.selectAll(':scope > path.y.origin')
        .data([ [[0, yScale.domain()[0]], [0, yScale.domain()[1]]] ])
      yOrigin.enter()
        .append('path')
        .attr('class', 'y origin')
        .attr('stroke', 'black')
        .attr('opacity', 0.2)
      yOrigin.attr('d', line)
    }

    // helper line y = 0
    if (options.yAxis.type === 'linear') {
      const xOrigin = content.selectAll(':scope > path.x.origin')
        .data([ [[xScale.domain()[0], 0], [xScale.domain()[1], 0]] ])
      xOrigin.enter()
        .append('path')
        .attr('class', 'x origin')
        .attr('stroke', 'black')
        .attr('opacity', 0.2)
      xOrigin.attr('d', line)
    }

    // annotations
    content
      .call(annotations({ owner: self }))

    // content construction
    // - join options.data to <g class='graph'> elements
    // - for each datum determine the sampler to use
    const graphs = content.selectAll(':scope > g.graph')
      .data(function (d) {
        return d.data.map(datumDefaults)
      })

    // enter
    graphs
      .enter()
      .append('g')
      .attr('class', 'graph')

    // enter + update
    graphs
      .each(function (d, index) {
        // additional options needed in the graph-types/helpers
        d.index = index

        d3Select(this)
          .call(graphTypes[d.graphType](self))
        d3Select(this)
          .call(helpers(self))
      })
  }

  Chart.prototype.buildZoomHelper = function () {
    // dummy rect (detects the zoom + drag)
    const self = this

    // enter
    this.draggable = this.canvas.enter
      .append('rect')
      .attr('class', 'zoom-and-drag')
      .style('fill', 'none')
      .style('pointer-events', 'all')

    // update
    this.canvas.select('.zoom-and-drag')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', function () {
        self.emit('all:mouseover')
      })
      .on('mouseout', function () {
        self.emit('all:mouseout')
      })
      .on('mousemove', function () {
        self.emit('all:mousemove')
      })
  }

  Chart.prototype.setUpPlugins = function () {
    const plugins = options.plugins || []
    const self = this
    plugins.forEach(function (plugin) {
      plugin(self)
    })
  }

  Chart.prototype.addLink = function () {
    for (let i = 0; i < arguments.length; i += 1) {
      this.linkedGraphs.push(arguments[i])
    }
  }

  Chart.prototype.updateAxes = function () {
    const instance = this
    const canvas = instance.canvas
    canvas.select('.x.axis').call(instance.meta.xAxis)
    canvas.select('.y.axis').call(instance.meta.yAxis)

    // updates the style of the axes
    canvas.selectAll('.axis path, .axis line')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('shape-rendering', 'crispedges')
      .attr('opacity', 0.1)
  }

  Chart.prototype.syncOptions = function () {
    // update the original options yDomain and xDomain
    this.options.xAxis.domain = this.meta.xScale.domain()
    this.options.yAxis.domain = this.meta.yScale.domain()
  }

  // TODO: refactor
  Chart.prototype.programmaticZoom = function (xDomain, yDomain) {
    const instance = this
    d3.transition()
      .duration(750)
      .tween('zoom', function () {
        const ix = d3.interpolate(xScale.domain(), xDomain)
        const iy = d3.interpolate(yScale.domain(), yDomain)
        return function (t) {
          zoomBehavior
            .x(xScale.domain(ix(t)))
            .y(yScale.domain(iy(t)))
          instance.draw()
        }
      })
      .each('end', function () {
        instance.emit('programmatic-zoom')
      })
  }

  Chart.prototype.getFontSize = function () {
    return Math.max(Math.max(width, height) / 50, 8)
  }

  Chart.prototype.draw = function () {
    const instance = this
    instance.emit('before:draw')
    instance.syncOptions()
    instance.updateAxes()
    instance.buildContent()
    instance.emit('after:draw')
  }

  Chart.prototype.setUpEventListeners = function () {
    const instance = this

    const events = {
      mousemove: function (coordinates) {
        instance.tip.move(coordinates)
      },

      mouseover: function () {
        instance.tip.show()
      },

      mouseout: function () {
        instance.tip.hide()
      },

      zoom: function (translate, scale) {
        zoomBehavior
          .translate(translate)
          .scale(scale)
      },

      'tip:update': function (x, y, index) {
        const meta = instance.root.datum().data[index]
        const title = meta.title || ''
        const format = meta.renderer || function (x, y) {
          return x.toFixed(3) + ', ' + y.toFixed(3)
        }

        const text = []
        title && text.push(title)
        text.push(format(x, y))

        instance.root.select('.top-right-legend')
          .attr('fill', globals.COLORS[index])
          .text(text.join(' '))
      }

    }

    const all = {
      mousemove: function () {
        const mouse = d3.mouse(instance.root.select('rect.zoom-and-drag').node())
        const coordinates = {
          x: xScale.invert(mouse[0]),
          y: yScale.invert(mouse[1])
        }
        instance.linkedGraphs.forEach(function (graph) {
          graph.emit('before:mousemove', coordinates)
          graph.emit('mousemove', coordinates)
        })
      },

      zoom: function (translate, scale) {
        instance.linkedGraphs.forEach(function (graph, i) {
          graph.emit('zoom', translate, scale)
          graph.draw()
        })

        // emit the position of the mouse to all the registered graphs
        instance.emit('all:mousemove')
      }

    }

    Object.keys(events).forEach(function (e) {
      instance.on(e, events[e])
      // create an event for each event existing on `events` in the form 'all:' event
      // e.g. all:mouseover all:mouseout
      // the objective is that all the linked graphs receive the same event as the current graph
      !all[e] && instance.on('all:' + e, function () {
        const args = Array.prototype.slice.call(arguments)
        instance.linkedGraphs.forEach(function (graph) {
          const localArgs = args.slice()
          localArgs.unshift(e)
          graph.emit.apply(graph, localArgs)
        })
      })
    })

    Object.keys(all).forEach(function (e) {
      instance.on('all:' + e, all[e])
    })
  }

  let instance = cache[options.id]
  if (!instance) {
    instance = new Chart()
  }
  return instance.build()
}

export default functionPlot
export { plugins, $eval, globals, graphTypes }
