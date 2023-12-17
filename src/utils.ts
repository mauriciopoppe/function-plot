import globals from './globals'

import { FunctionPlotDatum, FunctionPlotOptionsAxis } from './types'

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

  space: function (axis: FunctionPlotOptionsAxis, range: [number, number], n: number) {
    const lo = range[0]
    const hi = range[1]
    if (axis.type === 'log') {
      return this.logspace(Math.log10(lo), Math.log10(hi), n)
    }
    // default is linear
    return this.linspace(lo, hi, n)
  },

  /**
   * Creates `n` number of samples between `lo` and `hi` where consecutive
   * numbers are bucketed in `nGroups` groups.
   */
  spaceWithGroups: function (
    axis: FunctionPlotOptionsAxis,
    lo: number,
    hi: number,
    n: number,
    nGroups: number
  ): Array<Array<number>> {
    if (axis.type === 'log') {
      lo = Math.log10(lo)
      hi = Math.log10(hi)
    }
    const step = (hi - lo) / (n - 1)
    const groups: Array<Array<number>> = []
    const maxInGroup = Math.ceil(n / nGroups)
    let group: Array<number> = []
    groups.push(group)
    for (let i = 0; i < n; i += 1) {
      let v: number = lo + step * i
      if (axis.type === 'log') {
        v = Math.pow(10, v)
      }

      group.push(v)
      if (group.length === maxInGroup && groups.length < nGroups) {
        group = [v]
        groups.push(group)
      }
    }
    return groups
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

  clamp: function (v: number, vMin: number, vMax: number) {
    if (v < vMin) return vMin
    if (v > vMax) return vMax
    return v
  },

  color: function (data: FunctionPlotDatum, index: number): string {
    const indexModLenColor = index % globals.COLORS.length
    return data.color || globals.COLORS[indexModLenColor].hex()
  },

  /**
   * Infinity is a value that is close to Infinity but not Infinity, it can fit in a JS number.
   */
  infinity: function (): number {
    return 9007199254740991
  }
}

export default utils
