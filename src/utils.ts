import linspace from 'linspace'
import logspace from 'logspace'
import log10 from 'log10'
import {HSLColor} from "d3-color";

import globals from './globals'

import { Chart } from './index'
import { FunctionPlotDatum } from './types'

const utils = {
  isValidNumber: function (v: number) {
    return typeof v === 'number' && !isNaN(v)
  },

  space: function (chart: Chart, range: [number, number], n: number) {
    const lo = range[0]
    const hi = range[1]
    if (chart.options.xAxis.type === 'log') {
      return logspace(log10(lo), log10(hi), n)
    }
    // default is linear
    return linspace(lo, hi, n)
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
    if (v < 0) { return -1 }
    if (v > 0) { return 1 }
    return 0
  },

  color: function (data: FunctionPlotDatum, index: number): string {
    return data.color || globals.COLORS[index].hex()
  }
}

export default utils
