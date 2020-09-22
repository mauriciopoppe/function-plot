export interface Interval {
  lo: number
  hi: number
}

export interface FunctionPlotOptionsAxis {
  domain?: number[]
  type?: 'linear' | 'log'
  label?: string
  invert?: boolean
}

export interface FunctionPlotTip {
  xLine?: boolean
  yLine?: boolean
  renderer?: (x: number, y: number, index: number) => string
  owner?: any
}

export interface FunctionPlotDatumScope {
  [key: string]: any
}

export interface FunctionPlotDatumSecant {
  updateOnMouseMove?: boolean
  x0?: number
  x1?: number
  fn?: string
  scope?: FunctionPlotDatumScope
  $$mouseListener: any
}

export interface FunctionPlotDatumDerivative {
  updateOnMouseMove?: boolean
  x0?: number
  fn?: string
  scope?: FunctionPlotDatumScope
  $$mouseListener: any
}

export interface FunctionPlotDatum {
  fn?: string
  index?: number
  graphType?: 'polyline' | 'interval' | 'scatter'
  fnType?: 'linear' | 'parametric' | 'implicit' | 'polar' | 'points' | 'vector'
  sampler?: 'interval' | 'builtIn'
  nSamples?: number
  scope?: FunctionPlotDatumScope
  secants?: FunctionPlotDatumSecant[]
  derivative?: FunctionPlotDatumDerivative
  closed?: boolean
  color?: string
  attr?: any

  // polar?
  range?: [number, number]

  // point
  points?: number[][]

  // vector
  vector?: number[]
  offset?: number[]

  // helper data
  isHelper?: boolean
  skipBoundsCheck?: boolean
  skipTip?: boolean
}

export interface FunctionPlotAnnotation {
  x?: number
  y?: number
  text?: string
}

export interface FunctionPlotOptions {
  id: string
  target: string
  title?: string
  width?: number
  height?: number
  xAxis?: FunctionPlotOptionsAxis
  yAxis?: FunctionPlotOptionsAxis
  xDomain?: number[]
  yDomain?: number[]
  tip?: FunctionPlotTip
  grid?: boolean
  disableZoom?: boolean
  data?: FunctionPlotDatum[]
  annotations?: FunctionPlotAnnotation[]
  plugins?: any[]
}
