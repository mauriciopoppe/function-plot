import { select as d3Select } from 'd3-selection'
import type { Selection } from 'd3-selection'

import { builtIn as builtInEvaluator } from '../samplers/eval.mjs'
import datumDefaults from '../datum-defaults.js'
import { Polyline } from '../graph-types/index.js'
import { infinity } from '../utils.mjs'
import { Mark } from '../graph-types/mark.js'

import type { FunctionPlotDatum, FunctionPlotDatumScope, LinearFunction, SecantDatum } from '../types.js'

export class Secant extends Mark {
  private secantDefaults: LinearFunction

  constructor(options: any) {
    super(options)
    this.secantDefaults = datumDefaults({
      isHelper: true,
      skipTip: true,
      skipBoundsCheck: true,
      nSamples: 2,
      graphType: 'polyline'
    }) as LinearFunction
  }

  private computeSlope(scope: FunctionPlotDatumScope) {
    scope.m = (scope.y1 - scope.y0) / (scope.x1 - scope.x0)
  }

  private updateLine(d: FunctionPlotDatum, secant: SecantDatum) {
    if (!('x0' in secant)) {
      throw Error('secant must have the property `x0` defined')
    }
    secant.scope = secant.scope || {}

    const x0 = secant.x0
    const x1 = typeof secant.x1 === 'number' ? secant.x1 : infinity()
    Object.assign(secant.scope, {
      x0,
      x1,
      y0: builtInEvaluator(d, 'fn', { x: x0 }),
      y1: builtInEvaluator(d, 'fn', { x: x1 })
    })
    this.computeSlope(secant.scope)
  }

  private setFn(d: FunctionPlotDatum, secant: SecantDatum) {
    this.updateLine(d, secant)
    secant.fn = 'm * (x - x0) + y0'
  }

  private setMouseListener(
    d: FunctionPlotDatum,
    secantObject: SecantDatum,
    selection: Selection<any, FunctionPlotDatum, any, any>
  ) {
    if (secantObject.updateOnMouseMove && !secantObject.$$mouseListener) {
      secantObject.$$mouseListener = ({ x }: any) => {
        secantObject.x1 = x
        this.updateLine(d, secantObject)
        this.render(selection)
      }
      this.chart.on('tip:update', secantObject.$$mouseListener)
    }
  }

  private computeLines(d: FunctionPlotDatum, selection: Selection<any, FunctionPlotDatum, any, any>) {
    const data = []
    d.secants = d.secants || []
    for (let i = 0; i < d.secants.length; i += 1) {
      const secant = (d.secants[i] = Object.assign({}, this.secantDefaults, d.secants[i]))
      // necessary to make the secant have the same color as d
      secant.index = d.index
      if (!secant.fn) {
        this.setFn(d, secant)
        this.setMouseListener(d, secant, selection)
      }
      data.push(secant)
    }
    return data
  }

  render(selection: Selection<any, FunctionPlotDatum, any, any>) {
    selection.each((d, i, nodes) => {
      const el = d3Select(nodes[i])
      const data = this.computeLines(d, selection)
      const innerSelection = el.selectAll('g.secant').data(data)

      const innerSelectionEnter = innerSelection.enter().append('g').attr('class', 'secant')

      // enter + update
      innerSelection.merge(innerSelectionEnter).each((d: any, i, nodes) => {
        const polyline = new Polyline(d)
        polyline.chart = this.chart
        polyline.render(d3Select(nodes[i]))
      })

      // change the opacity of the secants
      innerSelection.merge(innerSelectionEnter).selectAll('path').attr('opacity', 0.5)

      // exit
      innerSelection.exit().remove()
    })
  }
}

export function secant(options: any) {
  return new Secant(options)
}
