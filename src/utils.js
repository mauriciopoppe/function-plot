import globals from './globals'
import linspace from 'linspace'
import logspace from 'logspace'
import log10 from 'log10'

const utils = {
  isValidNumber: function (v) {
    return typeof v === 'number' && !isNaN(v)
  },

  space: function (chart, range, n) {
    const lo = range[0]
    const hi = range[1]
    if (chart.options.xAxis.type === 'log') {
      return logspace(log10(lo), log10(hi), n)
    }
    // default is linear
    return linspace(lo, hi, n)
  },

  getterSetter: function (config, option) {
    const me = this
    this[option] = function (value) {
      if (!arguments.length) {
        return config[option]
      }
      config[option] = value
      return me
    }
  },

  sgn: function (v) {
    if (v < 0) { return -1 }
    if (v > 0) { return 1 }
    return 0
  },

  color: function (data, index) {
    return data.color || globals.COLORS[index]
  }
}

export default utils
