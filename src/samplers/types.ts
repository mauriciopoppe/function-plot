import { FunctionPlotDatum, FunctionPlotScale, FunctionPlotOptionsAxis } from '../types'

export type SamplerParams = {
  d: FunctionPlotDatum
  range: [number, number]
  xScale: FunctionPlotScale
  yScale: FunctionPlotScale
  xAxis: FunctionPlotOptionsAxis
  yAxis: FunctionPlotOptionsAxis
  nSamples: number
}

export type SamplerFn = (samplerParams: SamplerParams) => Array<any>
export type AsyncSamplerFn = (samplerParams: SamplerParams) => Promise<Array<any>>
