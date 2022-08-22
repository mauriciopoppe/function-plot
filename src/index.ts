import { line as d3Line, Line } from 'd3-shape'
import { format as d3Format } from 'd3-format'
import { scaleLinear as d3ScaleLinear, scaleLog as d3ScaleLog, ScaleLinear, ScaleLogarithmic } from 'd3-scale'
import { axisLeft as d3AxisLeft, axisBottom as d3AxisBottom, Axis } from 'd3-axis'
import { zoom as d3Zoom } from 'd3-zoom'
// @ts-ignore
import { select as d3Select, pointer as d3Pointer, Selection } from 'd3-selection'
import { interpolateRound as d3InterpolateRound } from 'd3-interpolate'
import EventEmitter from 'events'

import { FunctionPlotOptions, FunctionPlotDatum } from './types'

import annotations from './helpers/annotations'
import mousetip from './tip'
import helpers from './helpers'
import datumDefaults from './datum-defaults'
import globals from './globals'
import * as graphTypes from './graph-types'
import * as $eval from './helpers/eval'

require('./polyfills')

const d3Scale: {
  linear: () => ScaleLinear<number, number>,
  log: () => ScaleLogarithmic<number, number>
} = { linear: d3ScaleLinear, log: d3ScaleLog }

interface ChartMetaMargin {
  left?: number
  right?: number
  top?: number
  bottom?: number
}

export interface ChartMeta {
  /**
   * graph's left, right, top, bottom margins
   */
  margin?: ChartMetaMargin

  /**
   * width of the canvas (minus the margins)
   */
  width?: number

  /**
   * height of the canvas (minus the margins)
   */
  height?: number
  zoomBehavior?: any
  xScale?: ScaleLinear<number, number> | ScaleLogarithmic<number, number>
  yScale?: ScaleLinear<number, number> | ScaleLogarithmic<number, number>
  xAxis?: Axis<any>
  yAxis?: Axis<any>
  xDomain?: number[]
  yDomain?: number[]
}

/**
 * An instance can subscribe to any of the following events by doing `instance.on([eventName], callback)`,
 * events can be triggered by doing `instance.emit([eventName][, params])`
 *
 * - `mouseover` fired whenever the mouse is over the canvas
 * - `mousemove` fired whenever the mouse is moved inside the canvas, callback params: a single object `{x: number, y: number}` (in canvas space
 coordinates)
 * - `mouseout` fired whenever the mouse is moved outside the canvas
 * - `before:draw` fired before drawing all the graphs
 * - `after:draw` fired after drawing all the graphs
 * - `zoom:scaleUpdate` fired whenever the scale of another graph is updated, callback params `xScale`, `yScale`
 (x-scale and y-scale of another graph whose scales were updated)
 * - `tip:update` fired whenever the tip position is updated, callback params `{x, y, index}` (in canvas
 space coordinates, `index` is the index of the graph where the tip is on top of)
 * - `eval` fired whenever the sampler evaluates a function, callback params `data` (an array of segment/points),
 `index` (the index of datum in the `data` array), `isHelper` (true if the data is created for a helper e.g.
 for the derivative/secant)
 *
 * The following events are dispatched to all the linked graphs
 *
 * - `all:mouseover` same as `mouseover` but it's dispatched in each linked graph
 * - `all:mousemove` same as `mousemove` but it's dispatched in each linked graph
 * - `all:mouseout` same as `mouseout` but it's dispatched in each linked graph
 * - `all:zoom:scaleUpdate` same as `zoom:scaleUpdate` but it's dispatched in each linked graph
 * - `all:zoom` fired whenever there's scaling/translation on the graph, dispatched on all the linked graphs
 */
export class Chart extends EventEmitter.EventEmitter {
  static cache: Record<string, Chart> = {}

  private readonly id: string
  readonly markerId: string
  public options: FunctionPlotOptions
  public meta: ChartMeta

  /**
   * Array of function-plot instances linked to the events of this instance,
   i.e. when the zoom event is dispatched on this instance it's also dispatched on all the instances of
   this array
   */
  private linkedGraphs: Array<Chart>
  private line: Line<[number, number]>

  /**
   * `svg` element that holds the graph (canvas + title + axes)
   */
  public root: any

  /**
   * Element that holds the tip
   */
  public tip: any

  /**
   * `g.canvas` element that holds the area where the graphs are plotted (clipped with a mask)
   */
  public canvas: any

  /**
   * Element that holds the canvas where the functions are drawn
   */
  public content: any

  /**
   * Draggable element that receives zoom and pan events
   */
  public draggable: any

  constructor(options: FunctionPlotOptions) {
    super()

    const n = Math.random()
    const letter = String.fromCharCode(Math.floor(n * 26) + 97)
    this.options = options
    this.id = letter + n.toString(16).substr(2)
    this.options.id = this.id
    this.markerId = this.id + '-marker'
    Chart.cache[this.id] = this
    this.linkedGraphs = [this]
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

  private getDraggableNode() {
    return d3Select(this.options.target as any).select('.zoom-and-drag').node()
  }

  /**
   * The draggable container won't change across different instances of Chart,
   * therefore multiple instances will share the draggable container, to avoid dispatching
   * the event from the old instance grab it in runtime with this function
   */
  private getEmitInstance() {
    let cachedInstance = this
    const cachedNode = this.getDraggableNode()
    if (cachedNode) {
      cachedInstance = (cachedNode as any).instance
    }
    return cachedInstance
  }

  internalVars() {
    const self = this

    const margin = this.meta.margin = { left: 40, right: 20, top: 20, bottom: 20 }
    // if there's a title make the top margin bigger
    if (this.options.title) {
      this.meta.margin.top = 40
    }
    // inner width/height
    this.meta.width = (this.options.width || globals.DEFAULT_WIDTH) - margin.left - margin.right
    this.meta.height = (this.options.height || globals.DEFAULT_HEIGHT) - margin.top - margin.bottom

    this.initializeAxes()
  }

  initializeAxes() {
    const self = this

    const integerFormat = d3Format('~s')
    const floatFormat = d3Format('~e')
    function formatter(d: number): string {
      // take only the decimal part of the number
      const frac = Math.abs(d) - Math.floor(Math.abs(d))
      if (frac > 0) {
        return d.toString()
      } else {
        return integerFormat(d)
      }
    }

    function computeYScale(xScale: number[]) {
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

    if (!this.meta.xScale) {
      this.meta.xScale = d3Scale[this.options.xAxis.type]()
    }
    this.meta.xScale
      .domain(xDomain)
      // @ts-ignore domain always returns typeof this.meta.xDomain
      .range(this.options.xAxis.invert ? [this.meta.width, 0] : [0, this.meta.width])

    if (!this.meta.yScale) {
      this.meta.yScale = d3Scale[this.options.yAxis.type]()
    }
    this.meta.yScale
      .domain(yDomain)
      // @ts-ignore domain always returns typeof this.meta.yDomain
      .range(this.options.yAxis.invert ? [0, this.meta.height] : [this.meta.height, 0])

    if (!this.meta.xAxis) {
      this.meta.xAxis = d3AxisBottom(this.meta.xScale)
    }
    this.meta.xAxis
      .tickSize(this.options.grid ? -this.meta.height : 0)
      .tickFormat(formatter)
    if (!this.meta.yAxis) {
      this.meta.yAxis = d3AxisLeft(this.meta.yScale)
    }
    this.meta.yAxis
      .tickSize(this.options.grid ? -this.meta.width : 0)
      .tickFormat(formatter)

    this.line = d3Line()
      .x(function (d) { return self.meta.xScale(d[0]) })
      .y(function (d) { return self.meta.yScale(d[1]) })
  }

  drawGraphWrapper() {
    const root = this.root = d3Select(this.options.target as any)
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

    // helper to detect the closest fn to the cursor's current abscissa
    const tip = this.tip = mousetip(Object.assign(this.options.tip || {}, { owner: this }))
    this.canvas.merge(this.canvas.enter)
      .call(tip)

    this.setUpPlugins()

    // draw each datum after the wrapper and plugins were set up
    this.draw()

    // zoom helper on top
    this.buildZoomHelper()
  }

  buildTitle() {
    // join
    const selection = this.root.merge(this.root.enter)
      .selectAll('text.title')
      .data(function (d: FunctionPlotOptions) {
        return [d.title].filter(Boolean)
      })

    // enter
    const selectionEnter = selection.enter()
      .append('text')

    selectionEnter.merge(selection)
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
    // enter
    const canvas = this.canvas = this.root.merge(this.root.enter)
      .selectAll('.canvas')
      .data(function (d: FunctionPlotOptions) {
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
    const defs = this.canvas.enter
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
    const canvas = this.canvas

    const xLabel = canvas.merge(canvas.enter)
      .selectAll('text.x.axis-label')
      .data(function (d: FunctionPlotOptions) {
        return [d.xAxis.label].filter(Boolean)
      })
    const xLabelEnter = xLabel.enter()
      .append('text')
      .attr('class', 'x axis-label')
      .attr('text-anchor', 'end')

    xLabel.merge(xLabelEnter)
      .attr('x', this.meta.width)
      .attr('y', this.meta.height - 6)
      .text(function (d: string) { return d })

    xLabel.exit().remove()

    const yLabel = canvas.merge(canvas.enter)
      .selectAll('text.y.axis-label')
      .data(function (d: FunctionPlotOptions) {
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
      .text(function (d: string) { return d })

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
      .data(function (d: FunctionPlotOptions) { return [d] })

    // g tag clipped to hold the data
    const contentEnter = content.enter()
      .append('g')
      .attr('clip-path', 'url(#function-plot-clip-' + this.id + ')')
      .attr('class', 'content')

    // helper line, x = 0
    if (this.options.xAxis.type === 'linear') {
      const yOrigin = content.merge(contentEnter).selectAll(':scope > path.y.origin')
        .data([[
          [0, this.meta.yScale.domain()[0]],
          [0, this.meta.yScale.domain()[1]]
        ]])
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
      const xOrigin = content.merge(contentEnter).selectAll(':scope > path.x.origin')
        .data([[[this.meta.xScale.domain()[0], 0], [this.meta.xScale.domain()[1], 0]]])
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
      .data((d: FunctionPlotOptions) => d.data.map(datumDefaults))

    // enter
    const graphsEnter = graphs
      .enter()
      .append('g')
      .attr('class', 'graph')

    // enter + update
    graphs.merge(graphsEnter)
      .each(function (d: FunctionPlotDatum, index: number) {
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

    if (!this.meta.zoomBehavior) {
      this.meta.zoomBehavior = d3Zoom()
        .on('zoom', function onZoom(ev) {
          self.getEmitInstance().emit('all:zoom', ev)
        })
      // the zoom behavior must work with a copy of the scale, the zoom behavior has its own state and assumes
      // that its updating the original scale!
      // things that failed when I tried rescaleX(self.meta.xScale), the state of self.meta.xScale was a multiplied
      // for zoom/mousemove operations
      //
      // this copy should only be created once when the application starts
      self.meta.zoomBehavior.xScale = self.meta.xScale.copy()
      self.meta.zoomBehavior.yScale = self.meta.yScale.copy()
    }

    // in the case where the original scale domains were updated (because of a change in the size of the canvas)
    // update the range only but not the domain, the domain is going to be updated
    self.meta.zoomBehavior.xScale.range(self.meta.xScale.range())
    self.meta.zoomBehavior.yScale.range(self.meta.yScale.range())

    // enter
    this.canvas.enter
      .append('rect')
      .call(this.meta.zoomBehavior)
      .attr('class', 'zoom-and-drag')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', function (event: any) {
        self.getEmitInstance().emit('all:mouseover', event)
      })
      .on('mouseout', function (event: any) {
        self.getEmitInstance().emit('all:mouseout', event)
      })
      .on('mousemove', function (event: any) {
        self.getEmitInstance().emit('all:mousemove', event)
      })

    // update + enter
    this.draggable = this.canvas.merge(this.canvas.enter).select('.zoom-and-drag')
      .call((selection: any) => {
        if (selection.node()) {
          // store the instance for the next run
          selection.node().instance = self
        }
      })
      .attr('width', this.meta.width)
      .attr('height', this.meta.height)
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
    // update the original options yDomain and xDomain, this is done so that next calls to functionPlot()
    // with the same object preserve some of the computed state
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

    // before setting up the listeners, remove any listeners set on the previous instance, this happens because
    // the draggable container is shared across instances
    const prevInstance = this.getEmitInstance()
    if (prevInstance) {
      prevInstance.removeAllListeners()
    }

    const events = {
      mousemove: function (coordinates: { x: number, y: number }) {
        self.tip.move(coordinates)
      },

      mouseover: function () {
        self.tip.show()
      },

      mouseout: function () {
        self.tip.hide()
      },

      zoom: function zoom({ transform }: any) {
        // disable zoom
        if (self.options.disableZoom) return

        const xScaleClone = transform.rescaleX(self.meta.zoomBehavior.xScale).interpolate(d3InterpolateRound)
        const yScaleClone = transform.rescaleY(self.meta.zoomBehavior.yScale).interpolate(d3InterpolateRound)

        // update the scales's metadata
        // NOTE: setting self.meta.xScale = self.meta.zoomBehavior.xScale creates artifacts and weird lines
        self.meta.xScale
          .domain(xScaleClone.domain())
          // @ts-ignore domain always returns typeof this.meta.yDomain
          .range(xScaleClone.range())
        self.meta.yScale
          .domain(yScaleClone.domain())
          // @ts-ignore domain always returns typeof this.meta.yDomain
          .range(yScaleClone.range())
      },

      'tip:update': function ({ x, y, index }: any) {
        const meta = self.root.merge(self.root.enter).datum().data[index]
        const title = meta.title || ''
        const format = meta.renderer || function (x: number, y: number) {
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

    // all represents events that can be propagated to all the instances (including this one)
    const all = {
      mousemove: function (event: any) {
        const mouse = d3Pointer(event, self.draggable.node())
        const coordinates = {
          x: self.meta.xScale.invert(mouse[0]),
          y: self.meta.yScale.invert(mouse[1])
        }
        self.linkedGraphs.forEach(function (graph) {
          graph.emit('before:mousemove', coordinates)
          graph.emit('mousemove', coordinates)
        })
      },

      zoom: function (event: any) {
        self.linkedGraphs.forEach(function (graph) {
          // hack to synchronize the zoom state across all the instances
          graph.draggable.node().__zoom = self.draggable.node().__zoom

          graph.emit('zoom', event)
          graph.draw()
        })

        // emit the position of the mouse to all the registered graphs
        self.emit('all:mousemove', event)
      }
    }

    Object.keys(events).forEach(function (e) {
      // create an event for each event existing on `events` in the form 'all:' event
      // e.g. all:mouseover all:mouseout
      // the objective is that all the linked graphs receive the same event as the current graph
      // @ts-ignore

      !all[e] && self.on('all:' + e, function () {
        const args = Array.prototype.slice.call(arguments)
        self.linkedGraphs.forEach(function (graph) {
          const localArgs = args.slice()
          localArgs.unshift(e)
          graph.emit.apply(graph, localArgs)
        })
      })

      // @ts-ignore
      self.on(e, events[e])
    })

    Object.keys(all).forEach(function (e) {
      // @ts-ignore
      self.on('all:' + e, all[e])
    })
  }
}

function functionPlot(options: FunctionPlotOptions = { target: null }) {
  options.data = options.data || []
  let instance = Chart.cache[options.id]
  if (!instance) {
    instance = new Chart(options)
  }
  return instance.build()
}

functionPlot.globals = globals
functionPlot.$eval = $eval
functionPlot.graphTypes = graphTypes

export default functionPlot
