import { line as d3Line } from 'd3-shape'
import { format as d3Format } from 'd3-format'
import { scaleLinear as d3ScaleLinear, scaleLog as d3ScaleLog } from 'd3-scale'
import { axisLeft as d3AxisLeft, axisBottom as d3AxisBottom } from 'd3-axis'
import { zoom as d3Zoom, zoomIdentity as d3ZoomIdentity } from 'd3-zoom'
import { select as d3Select, pointer as d3Pointer } from 'd3-selection'
import { interpolateRound as d3InterpolateRound } from 'd3-interpolate'
import { default as EventEmitter } from 'events'

import annotations from './helpers/annotations'
import mousetip from './tip'
import helpers from './helpers'
import datumDefaults from './datum-defaults'
import globals from './globals'
import * as graphTypes from './graph-types'
import * as $eval from './helpers/eval'

require('./polyfills')

const cache = []
const d3Scale = { linear: d3ScaleLinear, log: d3ScaleLog }


class Chart extends EventEmitter {
  constructor(options) {
    super()

    const n = Math.random()
    const letter = String.fromCharCode(Math.floor(n * 26) + 97)
    this.id = options.id = letter + n.toString(16).substr(2)
    cache[this.id] = this

    this.linkedGraphs = [this]
    this.options = options
    // computed data
    this.meta = {}
    this.setUpEventListeners()
  }

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
  build() {
    this.internalVars()
    this.drawGraphWrapper()
    return this
  }

  initializeAxes() {
    const self = this
    const integerFormat = d3Format('~s')
    const floatFormat = d3Format('~e')
    const format = function (scale) {
      return function (d) {
        const isInteger = d === +d && d === (d | 0)
        if (!isInteger) {
          return floatFormat(d)
        }
        return integerFormat(d)
      }
    }

    function computeYScale (xScale) {
      // assumes that xScale is a linear scale
      const xDiff = xScale[1] - xScale[0]
      return self.meta.height * xDiff / self.meta.width
    }

    this.options.xAxis = this.options.xAxis || {}
    this.options.xAxis.type = this.options.xAxis.type || 'linear'

    this.options.yAxis = this.options.yAxis || {}
    this.options.yAxis.type = this.options.yAxis.type || 'linear'

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
    })(this.options.xAxis)

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
    })(this.options.yAxis)

    if (xDomain[0] >= xDomain[1]) {
      throw Error('the pair defining the x-domain is inverted')
    }
    if (yDomain[0] >= yDomain[1]) {
      throw Error('the pair defining the y-domain is inverted')
    }

    this.meta.xScale = d3Scale[this.options.xAxis.type]()
      .domain(xDomain)
      .range(this.options.xAxis.invert ? [this.meta.width, 0] : [0, this.meta.width])
    this.meta.yScale = d3Scale[this.options.yAxis.type]()
      .domain(yDomain)
      .range(this.options.yAxis.invert ? [0, this.meta.height] : [this.meta.height, 0])

    this.meta.xAxis = d3AxisBottom(this.meta.xScale)
      .tickSize(this.options.grid ? -this.meta.height : 0)
      .tickFormat(format(this.meta.xScale))
    this.meta.yAxis = d3AxisLeft(this.meta.yScale)
      .tickSize(this.options.grid ? -this.meta.width : 0)
      .tickFormat(format(this.meta.yScale))

    this.line = d3Line()
      .x(function (d) { return self.meta.xScale(d[0]) })
      .y(function (d) { return self.meta.yScale(d[1]) })
  }

  internalVars() {
    const self = this

    let margin = this.meta.margin = { left: 30, right: 30, top: 20, bottom: 20 }
    // margin = this.meta.margin = {left: 0, right: 0, top: 20, bottom: 20}
    // if there's a title make the top margin bigger
    if (this.options.title) {
      this.meta.margin.top = 40
    }
    // inner width/height
    this.meta.width = (this.options.width || globals.DEFAULT_WIDTH) -
      margin.left - margin.right
    this.meta.height = (this.options.height || globals.DEFAULT_HEIGHT) -
      margin.top - margin.bottom

    this.meta.zoomBehavior = d3Zoom()
      .on('zoom', function onZoom (ev, target) {
        self.emit('all:zoom', ev, target)
      })

    this.initializeAxes()
  }

  drawGraphWrapper () {
    const root = this.root = d3Select(this.options.target)
      .selectAll('svg')
      .data([this.options])

    // enter
    this.root.enter = root.enter()
      .append('svg')
      .attr('class', 'function-plot')
      .attr('font-size', this.getFontSize())

    // enter + update
    root.merge(this.root.enter)
      .attr('width', this.meta.width + this.meta.margin.left + this.meta.margin.right)
      .attr('height', this.meta.height + this.meta.margin.top + this.meta.margin.bottom)

    this.buildTitle()
    this.buildLegend()
    this.buildCanvas()
    this.buildClip()
    this.buildAxis()
    this.buildAxisLabel()

    // draw each datum after the wrapper was set up
    this.draw()

    // helper to detect the closest fn to the cursor's current abscissa
    const tip = this.tip = mousetip(Object.assign(this.options.tip || {}, { owner: this }))
    this.canvas.merge(this.canvas.enter)
      .call(tip)

    this.buildZoomHelper()
    this.setUpPlugins()
  }

  buildTitle() {
    // join
    const selection = this.root.merge(this.root.enter)
      .selectAll('text.title')
      .data(function (d) {
        return [d.title].filter(Boolean)
      })

    // enter
    selection.enter()
      .append('text')
      .attr('class', 'title')
      .attr('y', this.meta.margin.top / 2)
      .attr('x', this.meta.margin.left + this.meta.width / 2)
      .attr('font-size', 25)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(this.options.title)

    // exit
    selection.exit().remove()
  }

  buildLegend() {
    // enter
    this.root.enter
      .append('text')
      .attr('class', 'top-right-legend')
      .attr('text-anchor', 'end')

    // update + enter
    this.root.merge(this.root.enter)
      .select('.top-right-legend')
      .attr('y', this.meta.margin.top / 2)
      .attr('x', this.meta.width + this.meta.margin.left)
  }

  buildCanvas() {
    const self = this

    // enter
    const canvas = this.canvas = this.root.merge(this.root.enter)
      .selectAll('.canvas')
      .data(function (d) {
        return [d]
      })

    this.canvas.enter = canvas.enter()
      .append('g')
      .attr('class', 'canvas')

    // enter + update
  }

  buildClip() {
    // (so that the functions don't overflow on zoom or drag)
    const id = this.id
    const defs = this.canvas.merge(this.canvas.enter)
      .append('defs')

    defs.append('clipPath')
      .attr('id', 'function-plot-clip-' + id)
      .append('rect')
      .attr('class', 'clip static-clip')

    // enter + update
    this.canvas.merge(this.canvas.enter)
      .selectAll('.clip')
      .attr('width', this.meta.width)
      .attr('height', this.meta.height)

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

  buildAxis() {
    // axis creation
    const canvasEnter = this.canvas.enter
    canvasEnter.append('g')
      .attr('class', 'x axis')
    canvasEnter.append('g')
      .attr('class', 'y axis')

    // update
    this.canvas.merge(this.canvas.enter)
      .select('.x.axis')
      .attr('transform', 'translate(0,' + this.meta.height + ')')
      .call(this.meta.xAxis)
    this.canvas.merge(this.canvas.enter)
      .select('.y.axis')
      .call(this.meta.yAxis)
  }

  buildAxisLabel() {
    // axis labeling
    let xLabel, yLabel
    const canvas = this.canvas

    xLabel = canvas.merge(canvas.enter)
      .selectAll('text.x.axis-label')
      .data(function (d) {
        return [d.xAxis.label].filter(Boolean)
      })
    const xLabelEnter = xLabel.enter()
      .append('text')
      .attr('class', 'x axis-label')
      .attr('text-anchor', 'end')

    xLabel.merge(xLabelEnter)
      .attr('x', this.meta.width)
      .attr('y', this.meta.height - 6)
      .text(function (d) { return d })

    xLabel.exit().remove()

    yLabel = canvas.merge(canvas.enter)
      .selectAll('text.y.axis-label')
      .data(function (d) {
        return [d.yAxis.label].filter(Boolean)
      })

    const yLabelEnter = yLabel.enter()
      .append('text')
      .attr('class', 'y axis-label')
      .attr('y', 6)
      .attr('dy', '.75em')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-90)')

    yLabel.merge(yLabelEnter)
      .text(function (d) { return d })

    yLabel.exit().remove()
  }

  /**
   * @private
   *
   * Draws each of the datums stored in data.options, to do a full
   * redraw call `instance.draw()`
   */
  buildContent() {
    const self = this
    const canvas = this.canvas

    canvas.merge(canvas.enter)
      .attr('transform', 'translate(' + this.meta.margin.left + ',' + this.meta.margin.top + ')')

    const content = this.content = canvas.merge(canvas.enter)
      .selectAll(':scope > g.content')
      .data(function (d) { return [d] })

    // g tag clipped to hold the data
    const contentEnter = content.enter()
      .append('g')
      .attr('clip-path', 'url(#function-plot-clip-' + this.id + ')')
      .attr('class', 'content')

    // helper line, x = 0
    if (this.options.xAxis.type === 'linear') {
      const yOrigin = content.selectAll(':scope > path.y.origin')
        .data([ [[0, this.meta.yScale.domain()[0]], [0, this.meta.yScale.domain()[1]]] ])
      const yOriginEnter = yOrigin.enter()
        .append('path')
        .attr('class', 'y origin')
        .attr('stroke', 'black')
        .attr('opacity', 0.2)
      yOrigin.merge(yOriginEnter)
        .attr('d', this.line)
    }

    // helper line y = 0
    if (this.options.yAxis.type === 'linear') {
      const xOrigin = content.selectAll(':scope > path.x.origin')
        .data([ [[this.meta.xScale.domain()[0], 0], [this.meta.xScale.domain()[1], 0]] ])
      const xOriginEnter = xOrigin.enter()
        .append('path')
        .attr('class', 'x origin')
        .attr('stroke', 'black')
        .attr('opacity', 0.2)
      xOrigin.merge(xOriginEnter)
        .attr('d', this.line)
    }

    // annotations
    content.merge(contentEnter)
      .call(annotations({ owner: self }))

    // content construction
    // - join options.data to <g class='graph'> elements
    // - for each datum determine the sampler to use
    const graphs = content.merge(contentEnter)
      .selectAll(':scope > g.graph')
      .data(d => d.data.map(datumDefaults))

    // enter
    const graphsEnter = graphs
      .enter()
      .append('g')
      .attr('class', 'graph')

    // enter + update
    graphs.merge(graphsEnter)
      .each(function (d, index) {
        // additional options needed in the graph-types/helpers
        d.index = index

        const selection = d3Select(this)
        selection.call(graphTypes[d.graphType](self))
        selection.call(helpers(self))
      })
  }

  buildZoomHelper() {
    // dummy rect (detects the zoom + drag)
    const self = this

    // enter
    this.draggable = this.canvas.enter
      .append('rect')
      .call(this.meta.zoomBehavior)
      .call(this.meta.zoomBehavior.transform, d3ZoomIdentity)
      .attr('class', 'zoom-and-drag')
      .style('fill', 'none')
      .style('pointer-events', 'all')

    // update
    this.canvas.merge(this.canvas.enter)
      .select('.zoom-and-drag')
      .attr('width', this.meta.width)
      .attr('height', this.meta.height)
      .on('mouseover', function (event, target) {
        self.emit('all:mouseover', event, target)
      })
      .on('mouseout', function (event, target) {
        self.emit('all:mouseout', event, target)
      })
      .on('mousemove', function (event, target) {
        self.emit('all:mousemove', event, target)
      })
  }

  setUpPlugins() {
    const plugins = this.options.plugins || []
    const self = this
    plugins.forEach(function (plugin) {
      plugin(self)
    })
  }

  addLink() {
    for (let i = 0; i < arguments.length; i += 1) {
      this.linkedGraphs.push(arguments[i])
    }
  }

  updateAxes() {
    const instance = this
    const canvas = instance.canvas.merge(instance.canvas.enter)
    canvas.select('.x.axis').call(instance.meta.xAxis)
    canvas.select('.y.axis').call(instance.meta.yAxis)

    // updates the style of the axes
    canvas
      .selectAll('.axis path, .axis line')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('shape-rendering', 'crispedges')
      .attr('opacity', 0.1)
  }

  syncOptions() {
    // update the original options yDomain and xDomain
    this.options.xAxis.domain = this.meta.xScale.domain()
    this.options.yAxis.domain = this.meta.yScale.domain()
  }

  getFontSize() {
    return Math.max(Math.max(this.meta.width, this.meta.height) / 50, 8)
  }

  draw() {
    const instance = this
    instance.emit('before:draw')
    instance.syncOptions()
    instance.updateAxes()
    instance.buildContent()
    instance.emit('after:draw')
  }

  setUpEventListeners() {
    const self = this

    const events = {
      mousemove: function (coordinates) {
        self.tip.move(coordinates)
      },

      mouseover: function () {
        self.tip.show()
      },

      mouseout: function () {
        self.tip.hide()
      },

      zoom: function zoom ({ transform }, target) {
        // disable zoom
        if (self.options.disableZoom) return

        if (!self.meta.zoomBehavior.xScale) {
          // the zoom behavior must work with a copy of the scale, the zoom behavior has its own state and assumes
          // that its updating the original scale!
          // things that failed when I tried rescaleX(self.meta.xScale), the state of self.meta.xScale was a multiplied
          // for zoom/mousemove operations
          //
          // this copy should only be created once when the application starts
          self.meta.zoomBehavior.xScale = self.meta.xScale.copy()
          self.meta.zoomBehavior.yScale = self.meta.yScale.copy()
        }

        let xScaleClone = transform.rescaleX(self.meta.zoomBehavior.xScale).interpolate(d3InterpolateRound)
        let yScaleClone = transform.rescaleY(self.meta.zoomBehavior.yScale).interpolate(d3InterpolateRound)

        // update the scales's metadata
        // NOTE: setting self.meta.xScale = self.meta.zoomBehavior.xScale creates artifacts and weird lines
        self.meta.xScale
          .domain(xScaleClone.domain())
          .range(xScaleClone.range())
        self.meta.yScale
          .domain(yScaleClone.domain())
          .range(yScaleClone.range())

        // update the scales tied to the xAxis and yAxis
        self.meta.xAxis.scale(xScaleClone)
        self.meta.yAxis.scale(yScaleClone)
      },

      'tip:update': function (x, y, index) {
        const meta = self.root.merge(self.root.enter).datum().data[index]
        const title = meta.title || ''
        const format = meta.renderer || function (x, y) {
          return x.toFixed(3) + ', ' + y.toFixed(3)
        }

        const text = []
        title && text.push(title)
        text.push(format(x, y))

        self.root.select('.top-right-legend')
          .attr('fill', globals.COLORS[index])
          .text(text.join(' '))
      }

    }

    const all = {
      mousemove: function (event, target) {
        const mouse = d3Pointer(event)
        const coordinates = {
          x: self.meta.xScale.invert(mouse[0]),
          y: self.meta.yScale.invert(mouse[1])
        }
        self.linkedGraphs.forEach(function (graph) {
          graph.emit('before:mousemove', coordinates)
          graph.emit('mousemove', coordinates)
        })
      },

      zoom: function (event, target) {
        self.linkedGraphs.forEach(function (graph, i) {
          graph.emit('zoom', event, target)
          graph.draw()
        })

        // emit the position of the mouse to all the registered graphs
        self.emit('all:mousemove', event, target)
      }
    }

    Object.keys(events).forEach(function (e) {
      self.on(e, events[e])
      // create an event for each event existing on `events` in the form 'all:' event
      // e.g. all:mouseover all:mouseout
      // the objective is that all the linked graphs receive the same event as the current graph
      !all[e] && self.on('all:' + e, function () {
        const args = Array.prototype.slice.call(arguments)
        self.linkedGraphs.forEach(function (graph) {
          const localArgs = args.slice()
          localArgs.unshift(e)
          graph.emit.apply(graph, localArgs)
        })
      })
    })

    Object.keys(all).forEach(function (e) {
      self.on('all:' + e, all[e])
    })
  }
}

function functionPlot (options) {
  options = options || {}
  options.data = options.data || []

  let instance = cache[options.id]
  if (!instance) {
    instance = new Chart(options)
  }
  return instance.build()
}

functionPlot.globals = globals
functionPlot.$eval = $eval
functionPlot.graphTypes = graphTypes

export default functionPlot
