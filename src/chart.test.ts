import { describe, expect, it } from '@jest/globals'

import { Chart } from './chart'

describe('chart dimensions', () => {
  function createChart(coordinateSystem: 'cartesian' | 'polar', title?: string) {
    const chart = Object.create(Chart.prototype) as Chart
    chart.options = {
      target: '#playground',
      width: 550,
      height: 350,
      coordinateSystem,
      title,
      data: []
    }
    chart.meta = {}
    return chart
  }

  it('uses the full SVG viewport for the polar canvas and clip', () => {
    const chart = createChart('polar', 'Polar plot')
    chart.internalVars()
    expect(chart.meta.margin).toEqual({ left: 0, right: 0, top: 0, bottom: 0 })
    expect(chart.meta.width).toBe(550)
    expect(chart.meta.height).toBe(350)
  })

  it('retains axis and title margins for the Cartesian canvas and clip', () => {
    const chart = createChart('cartesian')
    chart.internalVars()
    expect(chart.meta.margin).toEqual({ left: 40, right: 20, top: 20, bottom: 20 })
    expect(chart.meta.width).toBe(490)
    expect(chart.meta.height).toBe(310)

    chart.options.title = 'Cartesian plot'
    chart.internalVars()
    expect(chart.meta.margin.top).toBe(40)
    expect(chart.meta.height).toBe(290)
  })
})
