import intervalArithmeticEval, { Interval } from 'interval-arithmetic-eval'

import { interval as evaluate } from '../helpers/eval'
import utils from '../utils'

import { FunctionPlotDatum } from '../types'
import { SamplerParams, SamplerFn } from './types'

// disable the use of typed arrays in interval-arithmetic to improve the performance
;(intervalArithmeticEval as any).policies.disableRounding()

function interval1d(samplerParams: SamplerParams): Array<any> {
  const xCoords = utils.space(samplerParams.xAxis, samplerParams.range, samplerParams.nSamples)
  const xScale = samplerParams.xScale
  const yScale = samplerParams.yScale
  const yMin = yScale.domain()[0]
  const yMax = yScale.domain()[1]
  const samples = []
  let i
  for (i = 0; i < xCoords.length - 1; i += 1) {
    const x = { lo: xCoords[i], hi: xCoords[i + 1] }
    const y = evaluate(samplerParams.d, 'fn', { x })
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

  ;(samples as any).scaledDx = xScale(xCoords[1]) - xScale(xCoords[0])
  return [samples]
}

let rectEps: number
function smallRect(x: Interval, y: Interval) {
  return Interval.width(x) < rectEps
}

function quadTree(x: Interval, y: Interval, d: FunctionPlotDatum) {
  const sample = evaluate(d, 'fn', { x, y })
  const fulfills = Interval.zeroIn(sample)
  if (!fulfills) {
    return this
  }
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

  quadTree.call(this, east, north, d)
  quadTree.call(this, east, south, d)
  quadTree.call(this, west, north, d)
  quadTree.call(this, west, south, d)
}

function interval2d(samplerParams: SamplerParams): Array<any> {
  const xScale = samplerParams.xScale
  const xDomain = samplerParams.xScale.domain()
  const yDomain = samplerParams.yScale.domain()
  const x = { lo: xDomain[0], hi: xDomain[1] }
  const y = { lo: yDomain[0], hi: yDomain[1] }
  const samples: any = []
  // 1 px
  rectEps = xScale.invert(1) - xScale.invert(0)
  quadTree.call(samples, x, y, samplerParams.d)
  samples.scaledDx = 1
  return [samples]
}

const sampler: SamplerFn = function sampler(samplerParams: SamplerParams): Array<any> {
  const fnTypes = {
    implicit: interval2d,
    linear: interval1d
  }
  if (!Object.hasOwn(fnTypes, samplerParams.d.fnType)) {
    throw Error(samplerParams.d.fnType + ' is not supported in the `interval` sampler')
  }
  // @ts-ignore
  return fnTypes[samplerParams.d.fnType].apply(null, arguments)
}

export default sampler
