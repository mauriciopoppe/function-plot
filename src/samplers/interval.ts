import intervalArithmeticEval, {Interval} from 'interval-arithmetic-eval'

import { interval as evaluate } from '../helpers/eval'
import utils from '../utils'

import { Chart } from "../index";
import { FunctionPlotDatum } from '../types'

// const Interval = (intervalArithmeticEval as any).Interval

// disable the use of typed arrays in interval-arithmetic to improve the performance
(intervalArithmeticEval as any).policies.disableRounding()

function interval1d (chart: Chart, d: FunctionPlotDatum, range: [number, number], nSamples: number) {
  const xCoords = utils.space(chart, range, nSamples)
  const xScale = chart.meta.xScale
  const yScale = chart.meta.yScale
  const yMin = yScale.domain()[0]
  const yMax = yScale.domain()[1]
  const samples = []
  let i
  for (i = 0; i < xCoords.length - 1; i += 1) {
    const x = { lo: xCoords[i], hi: xCoords[i + 1] }
    const y = evaluate(d, 'fn', { x: x })
    if (!Interval.isEmpty(y) && !Interval.isWhole(y)) {
      samples.push([x, y])
    }
    if (Interval.isWhole(y)) {
      // means that the next and prev intervals need to be fixed
      samples.push(null)
    }
  }

  // asymptote determination
  for (i = 1; i < samples.length - 1; i += 1) {
    if (!samples[i]) {
      const prev = samples[i - 1]
      const next = samples[i + 1]
      if (prev && next && !Interval.intervalsOverlap(prev[1], next[1])) {
        // case:
        //
        //   |
        //
        //     |
        //
        //   p n
        if (prev[1].lo > next[1].hi) {
          prev[1].hi = Math.max(yMax, prev[1].hi)
          next[1].lo = Math.min(yMin, next[1].lo)
        }
        // case:
        //
        //     |
        //
        //   |
        //
        //   p n
        if (prev[1].hi < next[1].lo) {
          prev[1].lo = Math.min(yMin, prev[1].lo)
          next[1].hi = Math.max(yMax, next[1].hi)
        }
      }
    }
  }

  (samples as any).scaledDx = xScale(xCoords[1]) - xScale(xCoords[0])
  return [samples]
}

let rectEps: number
function smallRect (x: Interval, y: Interval) {
  return Interval.width(x) < rectEps
}

function quadTree (x: Interval, y: Interval, meta: FunctionPlotDatum) {
  const sample = evaluate(meta, 'fn', {
    x: x,
    y: y
  })
  const fulfills = Interval.zeroIn(sample)
  if (!fulfills) { return this }
  if (smallRect(x, y)) {
    this.push([x, y])
    return this
  }
  const midX = x.lo + (x.hi - x.lo) / 2
  const midY = y.lo + (y.hi - y.lo) / 2
  const east = { lo: midX, hi: x.hi }
  const west = { lo: x.lo, hi: midX }
  const north = { lo: midY, hi: y.hi }
  const south = { lo: y.lo, hi: midY }

  quadTree.call(this, east, north, meta)
  quadTree.call(this, east, south, meta)
  quadTree.call(this, west, north, meta)
  quadTree.call(this, west, south, meta)
}

function interval2d (chart: Chart, meta: FunctionPlotDatum) {
  const xScale = chart.meta.xScale
  const xDomain = chart.meta.xScale.domain()
  const yDomain = chart.meta.yScale.domain()
  const x = { lo: xDomain[0], hi: xDomain[1] }
  const y = { lo: yDomain[0], hi: yDomain[1] }
  const samples: any = []
  // 1 px
  rectEps = xScale.invert(1) - xScale.invert(0)
  quadTree.call(samples, x, y, meta)
  samples.scaledDx = 1
  return [samples]
}

const sampler = function (chart: Chart, d: FunctionPlotDatum, range: [number, number], nSamples: number) {
  const fnTypes = {
    implicit: interval2d,
    linear: interval1d
  }
  if (!(fnTypes.hasOwnProperty(d.fnType))) {
    throw Error(d.fnType + ' is not supported in the `interval` sampler')
  }
  // @ts-ignore
  return fnTypes[d.fnType].apply(null, arguments)
}

export default sampler
