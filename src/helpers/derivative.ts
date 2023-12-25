import { select as d3Select, Selection } from 'd3-selection'

import { polyline } from '../graph-types/index.js'
import { builtIn as builtInEvaluator } from '../samplers/eval.mjs'
import datumDefaults from '../datum-defaults.js'
import { infinity } from '../utils.mjs'

import { Chart } from '../index.js'
import { FunctionPlotDatum } from '../types.js'

export default function derivative(chart: Chart) {
  const derivativeDatum = datumDefaults({
    isHelper: true,
    skipTip: true,
    skipBoundsCheck: true,
    nSamples: 2,
    graphType: 'polyline'
  })

  function computeLine(d: FunctionPlotDatum) {
    if (!d.derivative) {
      return []
    }
    const x0 = typeof d.derivative.x0 === 'number' ? d.derivative.x0 : infinity()
    derivativeDatum.index = d.index
    derivativeDatum.scope = {
      m: builtInEvaluator(d.derivative, 'fn', { x: x0 }),
      x0,
      y0: builtInEvaluator(d, 'fn', { x: x0 })
    }
    derivativeDatum.fn = 'm * (x - x0) + y0'
    return [derivativeDatum]
  }

  function checkAutoUpdate(d: FunctionPlotDatum) {
    const self = this
    if (!d.derivative) {
      return
    }
    if (d.derivative.updateOnMouseMove && !d.derivative.$$mouseListener) {
      d.derivative.$$mouseListener = function ({ x }: any) {
        // update initial value to be the position of the mouse
        // scope's x0 will be updated on the next call to `derivative(self)`
        if (d.derivative) {
          d.derivative.x0 = x
        }
        // trigger update (selection = self)
        derivative(self)
      }
      // if d.derivative is destroyed and recreated, the tip:update event
      // will be fired on the new d.derivative :)
      chart.on('tip:update', d.derivative.$$mouseListener)
    }
  }

  const derivative = function (selection: Selection<any, FunctionPlotDatum, any, any>) {
    selection.each(function (d) {
      const el = d3Select(this)
      const data = computeLine.call(selection, d)
      checkAutoUpdate.call(selection, d)
      const innerSelection = el.selectAll('g.derivative').data(data)

      const innerSelectionEnter = innerSelection.enter().append('g').attr('class', 'derivative')

      // enter + update
      innerSelection.merge(innerSelectionEnter).call(polyline(chart))

      // update
      // change the opacity of the line
      innerSelection.merge(innerSelectionEnter).selectAll('path').attr('opacity', 0.5)

      innerSelection.exit().remove()
    })
  }

  return derivative
}
