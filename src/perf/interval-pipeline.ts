/**
 * interval-pipeline evaluates the performance of the compile, eval, render pipeline,
 * the design is at /design/pipeline.md
 */

// @ts-ignore
import Benchmark from 'benchmark'
import { scaleLinear } from 'd3-scale'

import { FunctionPlotDatum, FunctionPlotOptionsAxis } from '../types'
import { createPathD } from '../graph-types/interval'
import interval from '../samplers/interval'

function createData(nSamples: number) {
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
    nSamples
  }
  const data = interval(samplerParams)
  return { data, xScale, yScale }
}

function compileAndEval() {
  const compileAndEval = new Benchmark.Suite()
  const nSamples = 1000
  compileAndEval
    .add(`compile and eval ${nSamples}`, function () {
      createData(nSamples)
    })
    // add listeners
    .on('cycle', function (event) {
      console.log(String(event.target))
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
    })
    .run({ async: false })
}

function drawPath() {
  const compileAndEval = new Benchmark.Suite()
  const nSamples = 1000
  const { xScale, yScale, data } = createData(nSamples)
  compileAndEval
    .add(`drawPath ${nSamples}`, function () {
      createPathD(xScale, yScale, 1 /* minWidthHeight, dummy = 1 */, data[0], false /* closed */)
    })
    // add listeners
    .on('cycle', function (event) {
      console.log(String(event.target))
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
    })
    .run({ async: false })
}

function main() {
  compileAndEval()
  drawPath()
}

main()
