import { line as d3Line, Line } from 'd3-shape'
import { format as d3Format } from 'd3-format'
import { scaleLinear as d3ScaleLinear, scaleLog as d3ScaleLog } from 'd3-scale'
import { axisLeft as d3AxisLeft, axisBottom as d3AxisBottom, Axis } from 'd3-axis'
import { zoom as d3Zoom } from 'd3-zoom'
import { select as d3Select, pointer as d3Pointer } from 'd3-selection'
import { interpolateRound as d3InterpolateRound } from 'd3-interpolate'
import EventEmitter from 'events'

import { FunctionPlotOptions, FunctionPlotDatum, FunctionPlotScale, FunctionPlotOptionsAxis } from './types.js'

import annotations from './helpers/annotations.js'
import mousetip from './tip.js'
import helpers from './helpers/index.js'
import datumDefaults from './datum-defaults.js'
import datumValidation from './datum-validation.js'
import globals from './globals.mjs'
import { randomId } from './utils.mjs'

export interface ChartMetaMargin {
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
  xScale?: FunctionPlotScale
  yScale?: FunctionPlotScale
  xAxis?: Axis<any>
  yAxis?: Axis<any>
  xDomain?: [number, number]
  yDomain?: [number, number]
}

function getD3Scale(type: 'linear' | 'log') {
  if (type === 'linear') return d3ScaleLinear
  return d3ScaleLog
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
 * - `zoom` fired whenever there's scaling/translation on the graph
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
 * - `all:zoom` fired whenever there's scaling/translation on the graph, dispatched on all the linked graphs
 */
export class Chart extends EventEmitter.EventEmitter {
  static cache: Record<string, Chart> = {}

  private readonly id: string

  public meta: ChartMeta
  /**
   * options are the input options sent to function plot.
   */
  public options: FunctionPlotOptions

  /**
   * Array of function-plot instances linked to the events of this instance,
   i.e. when the zoom event is dispatched on this instance it's also dispatched on all the instances of
   this array
   */
  private linkedGraphs: Array<Chart>
  private line: Line<[number, number]>

  /**
   * The number of times a function was rendered.
   */
  private generation: number

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

    this.options = options
    this.id = randomId()
    this.options.id = this.id
    Chart.cache[this.id] = this
    this.linkedGraphs = [this]
    this.meta = {}
    this.generation = 1
    this.setUpEventListeners()
  }

  /**
   * Rebuilds the entire graph from scratch recomputing
   *
   * - the inner width/height
   * - scales/axes
   *
   * After this is done it does a complete redraw of all the datums,
   * if only the datums need to be redrawn call `instance.renderContent()` instead
   *
   * @returns Chart
   */
  plot() {
    this.emit('before:plot')
    this.setDefaultOptions()
    this.validateOptions()
    this.buildInternalVars()
    this.render()
    this.emit('after:plot')
    return this
  }

  private getDraggableNode() {
    return d3Select(this.options.target as any)
      .select('.zoom-and-drag')
      .node()
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

  private setDefaultOptions() {
    this.options.x = this.options.x || {}
    this.options.x.type = this.options.x.type || 'linear'

    this.options.y = this.options.y || {}
    this.options.y.type = this.options.y.type || 'linear'

    for (let d of this.options.data) {
      datumDefaults(d)
    }
  }

  /**
   * Validate options provides best effort runtime validation of the options.
   */
  private validateOptions() {
    try {
      for (let datum of this.options.data) {
        datumValidation(datum)
      }
    } catch (e) {
      throw new Error(`detected invalid options: ${e}`, e)
    }
  }

  private buildInternalVars() {
    const margin = (this.meta.margin = { left: 40, right: 20, top: 20, bottom: 20 })
    // if there's a title make the top margin bigger
    if (this.options.title) {
      this.meta.margin.top = 40
    }
    // inner width/height
    this.meta.width = (this.options.width || globals.DEFAULT_WIDTH) - margin.left - margin.right
    this.meta.height = (this.options.height || globals.DEFAULT_HEIGHT) - margin.top - margin.bottom

    this.initializeAxes()
  }

  private initializeAxes() {
    const self = this

    const integerFormat = d3Format('~s')
    function formatter(d: number): string {
      // take only the decimal part of the number
      const frac = Math.abs(d) - Math.floor(Math.abs(d))
      if (frac > 0) {
        return d.toString()
      } else {
        return integerFormat(d)
      }
    }

    function computeYScale(xScale: [number, number]) {
      // assumes that xScale is a linear scale
      const xDiff = xScale[1] - xScale[0]
      return (self.meta.height * xDiff) / self.meta.width
    }

    const xDomain = (function (axis: FunctionPlotOptionsAxis): [number, number] {
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
    })(this.options.x)
    this.meta.xDomain = xDomain

    const yDomain = (function (axis: FunctionPlotOptionsAxis): [number, number] {
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
    })(this.options.y)
    this.meta.yDomain = yDomain

    if (!this.meta.xScale) {
      this.meta.xScale = getD3Scale(this.options.x.type)()
    }
    this.meta.xScale
      .domain(xDomain)
      // @ts-ignore domain always returns typeof this.meta.xDomain
      .range(this.options.x.invert ? [this.meta.width, 0] : [0, this.meta.width])

    if (!this.meta.yScale) {
      this.meta.yScale = getD3Scale(this.options.y.type)()
    }
    this.meta.yScale
      .domain(yDomain)
      // @ts-ignore domain always returns typeof this.meta.yDomain
      .range(this.options.y.invert ? [0, this.meta.height] : [this.meta.height, 0])

    if (!this.meta.xAxis) {
      this.meta.xAxis = d3AxisBottom(this.meta.xScale)
    }
    this.meta.xAxis.tickSize(this.options.grid ? -this.meta.height : 0).tickFormat(formatter)
    if (!this.meta.yAxis) {
      this.meta.yAxis = d3AxisLeft(this.meta.yScale)
    }
    this.meta.yAxis.tickSize(this.options.grid ? -this.meta.width : 0).tickFormat(formatter)

    this.line = d3Line()
      .x(function (d) {
        return self.meta.xScale(d[0])
      })
      .y(function (d) {
        return self.meta.yScale(d[1])
      })
  }

  private render() {
    const root = (this.root = d3Select(this.options.target as any)
      .selectAll('svg')
      .data([this.options]))

    // enter
    // prettier-ignore
    this.root.enter = root.enter().append('svg')
      .attr('class', 'function-plot')
      .attr('font-size', Math.max(Math.max(this.meta.width, this.meta.height) / 50, 8))

    // enter + update
    root
      .merge(this.root.enter)
      .attr('width', this.meta.width + this.meta.margin.left + this.meta.margin.right)
      .attr('height', this.meta.height + this.meta.margin.top + this.meta.margin.bottom)

    this.buildTitle()
    this.buildLegend()
    this.buildCanvas()
    this.buildClip()
    this.buildAxis()
    this.buildAxisLabel()

    // helper to detect the closest fn to the cursor's current abscissa
    const tip = (this.tip = mousetip(Object.assign(this.options.tip || {}, { owner: this })))
    this.canvas.merge(this.canvas.enter).call(tip)

    // draw each datum
    this.renderContent()

    // zoom helper is built last because it's the layer that detects
    // pan and scroll events
    this.buildZoomHelper()
  }

  private buildTitle() {
    // join
    const selection = this.root
      .merge(this.root.enter)
      .selectAll('text.title')
      .data(function (d: FunctionPlotOptions) {
        return [d.title].filter(Boolean)
      })

    // enter
    const selectionEnter = selection.enter().append('text')

    selectionEnter
      .merge(selection)
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

  private buildLegend() {
    // enter
    this.root.enter.append('text').attr('class', 'top-right-legend').attr('text-anchor', 'end')

    // update + enter
    this.root
      .merge(this.root.enter)
      .select('.top-right-legend')
      .attr('y', this.meta.margin.top / 2)
      .attr('x', this.meta.width + this.meta.margin.left)
  }

  private buildCanvas() {
    // enter
    const canvas = (this.canvas = this.root
      .merge(this.root.enter)
      .selectAll('.canvas')
      .data(function (d: FunctionPlotOptions) {
        return [d]
      }))

    this.canvas.enter = canvas.enter().append('g').attr('class', 'canvas')

    // enter + update
  }

  private buildClip() {
    // (so that the functions don't overflow on zoom or drag)
    const id = this.id
    const defs = this.canvas.enter.append('defs')
    defs
      .append('clipPath')
      .attr('id', 'function-plot-clip-' + id)
      .append('rect')
      .attr('class', 'clip static-clip')

    // enter + update
    this.canvas
      .merge(this.canvas.enter)
      .selectAll('.clip')
      .attr('width', this.meta.width)
      .attr('height', this.meta.height)
  }

  private buildAxis() {
    // axis creation
    const canvasEnter = this.canvas.enter
    canvasEnter.append('g').attr('class', 'x axis')
    canvasEnter.append('g').attr('class', 'y axis')

    // update
    this.canvas
      .merge(this.canvas.enter)
      .select('.x.axis')
      .attr('transform', 'translate(0,' + this.meta.height + ')')
      .call(this.meta.xAxis)

    this.canvas.merge(this.canvas.enter).select('.y.axis').call(this.meta.yAxis)
  }

  private buildAxisLabel() {
    // axis labeling
    const canvas = this.canvas

    const xLabel = canvas
      .merge(canvas.enter)
      .selectAll('text.x.axis-label')
      .data(function (d: FunctionPlotOptions) {
        return [d.x.label].filter(Boolean)
      })
    // prettier-ignore
    const xLabelEnter = xLabel.enter().append('text')
      .attr('class', 'x axis-label')
      .attr('text-anchor', 'end')

    xLabel
      .merge(xLabelEnter)
      .attr('x', this.meta.width)
      .attr('y', this.meta.height - 6)
      .text(function (d: string) {
        return d
      })

    xLabel.exit().remove()

    const yLabel = canvas
      .merge(canvas.enter)
      .selectAll('text.y.axis-label')
      .data(function (d: FunctionPlotOptions) {
        return [d.y.label].filter(Boolean)
      })

    const yLabelEnter = yLabel
      .enter()
      .append('text')
      .attr('class', 'y axis-label')
      .attr('y', 6)
      .attr('dy', '.75em')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-90)')

    yLabel.merge(yLabelEnter).text(function (d: string) {
      return d
    })

    yLabel.exit().remove()
  }

  /**
   * Draws each of the datums stored in data.options only
   * To do a full redraw call `instance.plot()`
   */
  private buildContent() {
    const self = this
    const canvas = this.canvas

    canvas
      .merge(canvas.enter)
      .attr('transform', 'translate(' + this.meta.margin.left + ',' + this.meta.margin.top + ')')

    const content = canvas
      .merge(canvas.enter)
      .selectAll(':scope > g.content')
      .data(function (d: FunctionPlotOptions) {
        return [d]
      })
    this.content = content

    // g tag clipped to hold the data
    const contentEnter = content
      .enter()
      .append('g')
      .attr('clip-path', 'url(#function-plot-clip-' + this.id + ')')
      .attr('class', 'content')

    // helper line, x = 0
    if (this.options.x.type === 'linear') {
      const yOrigin = content
        .merge(contentEnter)
        .selectAll(':scope > path.y.origin')
        .data([
          [
            [0, this.meta.yScale.domain()[0]],
            [0, this.meta.yScale.domain()[1]]
          ]
        ])
      const yOriginEnter = yOrigin
        .enter()
        .append('path')
        .attr('class', 'y origin')
        .attr('stroke', 'currentColor')
        .attr('opacity', 0.2)
      yOrigin.merge(yOriginEnter).attr('d', this.line)
    }

    // helper line y = 0
    if (this.options.y.type === 'linear') {
      const xOrigin = content
        .merge(contentEnter)
        .selectAll(':scope > path.x.origin')
        .data([
          [
            [this.meta.xScale.domain()[0], 0],
            [this.meta.xScale.domain()[1], 0]
          ]
        ])
      const xOriginEnter = xOrigin
        .enter()
        .append('path')
        .attr('class', 'x origin')
        .attr('stroke', 'currentColor')
        .attr('opacity', 0.2)
      xOrigin.merge(xOriginEnter).attr('d', this.line)
    }

    // annotations
    content.merge(contentEnter).call(annotations({ owner: self }))

    // content construction
    // - join options.data to <g class='graph'> elements
    // - for each datum determine the sampler to use
    const graphs = content
      .merge(contentEnter)
      .selectAll(':scope > g.graph')
      .data(
        (d: FunctionPlotOptions) => {
          return d.data
        },
        (d: any) => {
          // The key is the function set or other value that uniquely identifies the datum.
          return d.fn || d.r || d.x || d.text
        }
      )

    // exit
    graphs.exit().remove()

    // enter
    const graphsEnter = graphs.enter().append('g').attr('class', 'graph')

    // enter + update
    graphs.merge(graphsEnter).each(function (d: FunctionPlotDatum, index: number) {
      // additional options needed in the graph-types/helpers
      d.index = index

      // (hidden property)
      // @ts-ignore
      d.generation = self.generation

      const selection = d3Select(this)
      selection.call(globals.graphTypes[d.graphType](self))
      selection.call(helpers(self))
    })
    this.generation += 1
  }

  private buildZoomHelper() {
    // dummy rect (detects the zoom + drag)
    const self = this

    if (!this.meta.zoomBehavior) {
      this.meta.zoomBehavior = d3Zoom().on('zoom', function onZoom(ev) {
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
    this.draggable = this.canvas
      .merge(this.canvas.enter)
      .select('.zoom-and-drag')
      .call((selection: any) => {
        if (selection.node()) {
          // store the instance for the next run
          selection.node().instance = self
        }
      })
      .attr('width', this.meta.width)
      .attr('height', this.meta.height)
  }

  private renderAxes() {
    const instance = this
    const canvas = instance.canvas.merge(instance.canvas.enter)

    // Draw the x-axis
    canvas.select('.x.axis').attr('transform', `translate(0, ${this.meta.height})`).call(instance.meta.xAxis)

    if (this.options.x.position === 'sticky') {
      const yMin = this.meta.yScale.domain()[0]
      const yMax = this.meta.yScale.domain()[1]
      const yMid = (yMax + yMin) / 2
      const yScaleFactor = this.meta.height / (yMax - yMin)

      let yTranslation = yScaleFactor * yMid + this.meta.height / 2
      yTranslation = yTranslation < 0 ? 0 : yTranslation
      yTranslation = yTranslation > this.meta.height ? this.meta.height : yTranslation

      canvas.select('.x.axis').attr('transform', 'translate(0,' + yTranslation + ')')

      canvas
        .selectAll('.x.axis path, .x.axis line')
        .attr('transform', 'translate(0,' + (this.meta.height / 2 - yTranslation + this.meta.height / 2) + ')')
    }

    // Draw the y-axis
    canvas.select('.y.axis').attr('transform', `translate(0, 0)`).call(instance.meta.yAxis)

    if (this.options.y.position === 'sticky') {
      const xMin = this.meta.xScale.domain()[0]
      const xMax = this.meta.xScale.domain()[1]
      const xMid = (xMax + xMin) / 2
      const xScaleFactor = this.meta.width / (xMin - xMax)

      let xTranslation = xScaleFactor * xMid + this.meta.width / 2
      xTranslation = xTranslation < 0 ? 0 : xTranslation
      xTranslation = xTranslation > this.meta.width ? this.meta.width : xTranslation
      canvas.select('.y.axis').attr('transform', 'translate(' + xTranslation + ',0)')

      canvas.selectAll('.y.axis path, .y.axis line').attr('transform', 'translate(' + -xTranslation + ',0)')
    }

    canvas.selectAll('.axis path, .axis line').attr('stroke', 'currentColor').attr('opacity', 0.2)
  }

  private syncOptions() {
    // update the original options yDomain and xDomain, this is done so that next calls to functionPlot()
    // with the same object preserve some of the computed state
    this.options.x.domain = [this.meta.xScale.domain()[0], this.meta.xScale.domain()[1]]
    this.options.y.domain = [this.meta.yScale.domain()[0], this.meta.yScale.domain()[1]]
  }

  // renderContent is a perf optimization to only render the content
  // without rendering the canvas beneath it.
  private renderContent() {
    const instance = this
    instance.emit('before:renderContent')
    instance.syncOptions()
    instance.renderAxes()
    instance.buildContent()
    instance.emit('after:renderContent')
  }

  private setUpEventListeners() {
    const self = this

    // before setting up the listeners, remove any listeners set on the previous instance, this happens because
    // the draggable container is shared across instances
    const prevInstance = this.getEmitInstance()
    if (prevInstance) {
      prevInstance.removeAllListeners()
    }

    type EventsWithListener = { [key: string]: (...args: any[]) => any }

    const eventsThisInstance: EventsWithListener = {
      mousemove: function (coordinates: { x: number; y: number }) {
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
        const format =
          meta.renderer ||
          function (x: number, y: number) {
            return x.toFixed(3) + ', ' + y.toFixed(3)
          }

        const text = []
        title && text.push(title)
        text.push(format(x, y))

        self.root.select('.top-right-legend').attr('fill', globals.COLORS[index]).text(text.join(' '))
      }
    }

    // all represents events that can be propagated to all the instances (including this one)
    const eventsAllInstances = {
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
          graph.renderContent()
        })

        // emit the position of the mouse to all the registered graphs
        self.emit('all:mousemove', event)
      }
    }

    // set listeners for this instance.
    for (const [event, callback] of Object.entries(eventsThisInstance)) {
      this.on(event, callback)
    }

    // set listeners for all instances.
    for (const [event, callback] of Object.entries(eventsAllInstances)) {
      this.on(`all:${event}`, callback)
    }
    for (const [event] of Object.entries(eventsThisInstance)) {
      if (!Object.hasOwn(eventsAllInstances, event)) {
        // create an event for each event existing on `eventsThisInstance` in the form 'all:' event
        // e.g. all:mouseover all:mouseout
        // the objective is that all the linked graphs receive the same event as the current graph
        this.on(`all:${event}`, function (...args) {
          for (let i = 0; i < this.linkedGraphs.length; i += 1) {
            const graph = this.linkedGraphs[i]
            graph.emit(event, ...args)
          }
        })
      }
    }
  }

  addLink(...args: Chart[]) {
    for (let i = 0; i < args.length; i += 1) {
      this.linkedGraphs.push(args[i])
    }
  }

  /**
   * Removes a linked graph.
   */
  removeLink(instance: Chart) {
    const idx = this.linkedGraphs.indexOf(instance)
    if (idx > -1) {
      this.linkedGraphs = this.linkedGraphs.splice(idx, 1)
    }
  }

  /**
   * Destroys this instance of functionPlot,
   * if you added this to other instances through `addLink` make
   * sure you remove the links from the other instances to this
   * instance using `removeLink`.
   */
  destroy() {
    this.removeAllListeners()
    d3Select(this.options.target as any)
      .selectAll('svg')
      .remove()
  }
}
