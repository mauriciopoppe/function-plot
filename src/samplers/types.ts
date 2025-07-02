import type { FunctionPlotDatum, FunctionPlotScale, FunctionPlotOptionsAxis } from '../types.js'

export type SamplerParams = {
  d: FunctionPlotDatum
  range: [number, number]
  xScale: FunctionPlotScale
  yScale: FunctionPlotScale
  xAxis: FunctionPlotOptionsAxis
  yAxis: FunctionPlotOptionsAxis
  nSamples: number

  // The number of groups to use for split.
  nGroups?: number
}

export type TInterval = { lo: number; hi: number }
export type IntervalSamplerResultSingle = [TInterval, TInterval] | null
export type IntervalSamplerResultGroup = Array<IntervalSamplerResultSingle>
export type IntervalSamplerResult = Array<IntervalSamplerResultGroup>

export type BuiltInSamplerResultSingle = [number, number]
export type BuiltInSamplerResultGroup = Array<BuiltInSamplerResultSingle>
export type BuiltInSamplerResult = Array<BuiltInSamplerResultGroup>

export type SamplerFn = (samplerParams: SamplerParams) => Array<any>
export type AsyncSamplerFn = (samplerParams: SamplerParams) => Promise<Array<any>>
