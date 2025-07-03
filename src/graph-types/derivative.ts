import { select as d3Select } from 'd3-selection'
import type { Selection } from 'd3-selection'

import { Polyline } from '../graph-types/index.js'
import { builtIn as builtInEvaluator } from '../samplers/eval.mjs'
import datumDefaults from '../datum-defaults.js'
import { infinity } from '../utils.mjs'
import { Mark } from '../graph-types/mark.js'

import type { FunctionPlotDatum, LinearFunction } from '../types.js'

export class Derivative extends Mark {
  private derivativeDatum: LinearFunction

  constructor(options: any) {
    super(options)
    this.derivativeDatum = datumDefaults({
      isHelper: true,
      skipTip: true,
      skipBoundsCheck: true,
      nSamples: 2,
      graphType: 'polyline'
    }) as LinearFunction
  }

  private computeLine(d: FunctionPlotDatum) {
    if (!d.derivative) {
      return []
    }
    const x0 = typeof d.derivative.x0 === 'number' ? d.derivative.x0 : infinity()
    this.derivativeDatum.index = d.index
    this.derivativeDatum.scope = {
      m: builtInEvaluator(d.derivative, 'fn', { x: x0 }),
      x0,
      y0: builtInEvaluator(d, 'fn', { x: x0 })
    }
    this.derivativeDatum.fn = 'm * (x - x0) + y0'
    return [this.derivativeDatum]
  }

  private checkAutoUpdate(d: FunctionPlotDatum, selection: Selection<any, FunctionPlotDatum, any, any>) {
    if (!d.derivative) {
      return
    }
    if (d.derivative.updateOnMouseMove && !d.derivative.$$mouseListener) {
      d.derivative.$$mouseListener = ({ x }: any) => {
        if (d.derivative) {
          d.derivative.x0 = x
        }
        this.render(selection)
      }
      this.chart.on('tip:update', d.derivative.$$mouseListener)
    }
  }

  render(selection: Selection<any, FunctionPlotDatum, any, any>) {
    selection.each((d, i, nodes) => {
      const el = d3Select(nodes[i])
      const data = this.computeLine(d)
      this.checkAutoUpdate(d, selection)
      const innerSelection = el.selectAll('g.derivative').data(data)

      const innerSelectionEnter = innerSelection.enter().append('g').attr('class', 'derivative')

      innerSelection.merge(innerSelectionEnter).each((innerData: any, i, innerNodes) => {
        const polyline = new Polyline(innerData)
        polyline.chart = this.chart
        polyline.render(d3Select(innerNodes[i]))
      })

      innerSelection.merge(innerSelectionEnter).selectAll('path').attr('opacity', 0.5)

      innerSelection.exit().remove()
    })
  }
}

export function derivative(options: any) {
  return new Derivative(options)
}
