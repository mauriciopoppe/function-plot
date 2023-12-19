/**
 * interval-pipeline evaluates the performance of the compile, eval, render pipeline,
 * the design is at /design/pipeline.md
 */

import { Bench } from 'tinybench'
import { scaleLinear } from 'd3-scale'

import globals from '../globals.mjs'
import { IntervalWorkerPool } from '../samplers/interval_worker_pool'
import { FunctionPlotDatum, FunctionPlotOptionsAxis } from '../types'
import { createPathD } from '../graph-types/interval'
import { asyncSamplerInterval, syncSamplerInterval } from '../samplers/interval'

async function createData(nSamples: number, nGroups: number, async: boolean) {
  const width = 500
  const height = 300
  const xDomain: [number, number] = [-5, 5]
  const yDomain: [number, number] = [-5, 5]
  const xScale = scaleLinear().domain(xDomain).range([0, width])
  const yScale = scaleLinear().domain(yDomain).range([height, 0])
  const d: FunctionPlotDatum = {
    fn: '1/x',
    fnType: 'linear'
  }
  const xAxis: FunctionPlotOptionsAxis = { type: 'linear' }
  const yAxis: FunctionPlotOptionsAxis = { type: 'linear' }
  const samplerParams = {
    d,
    range: xDomain,
    xScale,
    yScale,
    xAxis,
    yAxis,
    nSamples,
    nGroups
  }
  let data
  if (async) {
    data = await asyncSamplerInterval(samplerParams)
  } else {
    data = syncSamplerInterval(samplerParams)
  }
  return { data, xScale, yScale }
}

async function compileAndEval() {
  // setup workerPool
  globals.workerPool = new IntervalWorkerPool(8)

  const nSamplesToTest = [350, 750, 1800, 3600]
  const nGroupsToTest = [4, 8, 12]
  for (const nSamples of nSamplesToTest) {
    const bench = new Bench()
    for (const nGroups of nGroupsToTest) {
      bench.add(`nSamples=${nSamples} nGroups=${nGroups} compile and eval sync`, async function () {
        await createData(nSamples, nGroups, false)
      })
      bench.add(`nSamples=${nSamples} nGroups=${nGroups} compile and eval async`, async function () {
        await createData(nSamples, nGroups, true)
      })
    }
    await bench.run()
    console.table(bench.table())
  }
}

async function drawPath() {
  const bench = new Bench()
  const nSamples = 1000
  const { xScale, yScale, data } = await createData(nSamples, 4, false)
  bench.add(`drawPath ${nSamples}`, function () {
    createPathD(xScale, yScale, 1 /* minWidthHeight, dummy = 1 */, data[0], false /* closed */)
  })

  await bench.run()
  console.table(bench.table())
}

async function main() {
  await compileAndEval()
  await drawPath()
  await globals.workerPool.terminate()
}

main()
