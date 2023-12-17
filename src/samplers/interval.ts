import intervalArithmeticEval, { Interval } from 'interval-arithmetic-eval'

import { interval as evaluate } from '../helpers/eval.mjs'
import utils from '../utils'
import globals from '../globals'

import { FunctionPlotDatum } from '../types'
import { SamplerParams, SamplerFn, AsyncSamplerFn } from './types'

// disable the use of typed arrays in interval-arithmetic to improve the performance
;(intervalArithmeticEval as any).policies.disableRounding()

type TInterval = { lo: number; hi: number }
type SamplerResultSingle = [TInterval, TInterval] | null
type SamplerResultGroup = Array<SamplerResultSingle>
type SamplerResult = Array<SamplerResultGroup>

async function asyncInterval1d({ d, xAxis, range, nSamples, xScale, yScale }: SamplerParams): Promise<SamplerResult> {
  const groups = 1
  const xCoords = utils.spaceWithGroups(xAxis, range[0], range[1], nSamples, groups)
  if (xCoords.length !== groups) {
    throw new Error(`expecting ${xCoords.length} to equal ${groups}`)
  }
  const workerPoolInterval = globals.workerPool
  const promises: Array<Promise<any>> = []
  for (let i = 0; i < xCoords.length; i += 1) {
    promises.push(workerPoolInterval.queue({ d, xCoords: xCoords[i] }))
  }

  const allSamples = await Promise.all(promises)
  const samples: SamplerResultGroup = []
  for (let i = 0; i < allSamples.length; i += 1) {
    if (allSamples[i]) {
      for (let j = 0; j < (allSamples[i] as any).length; j += 1) {
        samples.push(allSamples[i][j])
      }
    }
  }

  // asymptote determination
  const yMin = yScale.domain()[0] - utils.infinity()
  const yMax = yScale.domain()[1] + utils.infinity()
  for (let i = 1; i < samples.length - 1; i += 1) {
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

  ;(samples as any).scaledDx = xScale(xCoords[0][1]) - xScale(xCoords[0][0])
  return [samples]
}

function interval1d({ d, xAxis, range, nSamples, xScale, yScale }: SamplerParams): SamplerResult {
  const xCoords = utils.space(xAxis, range, nSamples)
  const samples: SamplerResultGroup = []
  for (let i = 0; i < xCoords.length - 1; i += 1) {
    const x = { lo: xCoords[i], hi: xCoords[i + 1] }
    const y = evaluate(d, 'fn', { x })
    if (!Interval.isEmpty(y) && !Interval.isWhole(y)) {
      samples.push([x, y])
    }
    if (Interval.isWhole(y)) {
      // means that the next and prev intervals need to be fixed
      samples.push(null)
    }
  }

  // asymptote determination
  const yMin = yScale.domain()[0] - utils.infinity()
  const yMax = yScale.domain()[1] + utils.infinity()
  for (let i = 1; i < samples.length - 1; i += 1) {
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
function smallRect(x: Interval, _: Interval) {
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

function interval2d(samplerParams: SamplerParams): SamplerResult {
  const xScale = samplerParams.xScale
  const xDomain = samplerParams.xScale.domain()
  const yDomain = samplerParams.yScale.domain()
  const x = { lo: xDomain[0], hi: xDomain[1] }
  const y = { lo: yDomain[0], hi: yDomain[1] }
  const samples: SamplerResultGroup = []
  // 1 px
  rectEps = xScale.invert(1) - xScale.invert(0)
  quadTree.call(samples, x, y, samplerParams.d)
  ;(samples as any).scaledDx = 1
  return [samples]
}

const syncSamplerInterval: SamplerFn = function sampler(samplerParams: SamplerParams): SamplerResult {
  switch (samplerParams.d.fnType) {
    case 'linear':
      return interval1d(samplerParams)
    case 'implicit':
      return interval2d(samplerParams)
    default:
      throw new Error(samplerParams.d.fnType + ' is not supported in the `interval` sync sampler')
  }
}

const asyncSamplerInterval: AsyncSamplerFn = async function sampler(
  samplerParams: SamplerParams
): Promise<SamplerResult> {
  switch (samplerParams.d.fnType) {
    case 'linear':
      return asyncInterval1d(samplerParams)
    default:
      throw new Error(samplerParams.d.fnType + ' is not supported in the `interval` async sampler')
  }
}

export { syncSamplerInterval, asyncSamplerInterval }
