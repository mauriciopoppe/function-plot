import globals from './globals'

import { Chart } from './index'
import { FunctionPlotDatum } from './types'

const utils = {
  linspace: function (lo: number, hi: number, n: number): number[] {
    const step = (hi - lo) / (n - 1)
    return Array.from({ length: n }, (_, i) => lo + step * i)
  },

  logspace: function (lo: number, hi: number, n: number): number[] {
    return this.linspace(lo, hi, n).map((x: number) => Math.pow(10, x))
  },

  isValidNumber: function (v: number) {
    return typeof v === 'number' && !isNaN(v)
  },

  space: function (chart: Chart, range: [number, number], n: number) {
    const lo = range[0]
    const hi = range[1]
    if (chart.options.xAxis.type === 'log') {
      return this.logspace(Math.log10(lo), Math.log10(hi), n)
    }
    // default is linear
    return this.linspace(lo, hi, n)
  },

  getterSetter: function (config: any, option: string) {
    const me = this
    this[option] = function (value: any) {
      if (!arguments.length) {
        return config[option]
      }
      config[option] = value
      return me
    }
  },

  sgn: function (v: number) {
    if (v < 0) {
      return -1
    }
    if (v > 0) {
      return 1
    }
    return 0
  },

  color: function (data: FunctionPlotDatum, index: number): string {
    const indexModLenColor = index % globals.COLORS.length
    return data.color || globals.COLORS[indexModLenColor].hex()
  }
}

export default utils
