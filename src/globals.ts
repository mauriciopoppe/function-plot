import { hsl as d3Hsl, HSLColor } from 'd3-color'

import { GraphTypeBuilder } from './graph-types/types'

export type TGlobals = {
  COLORS: Array<HSLColor>
  DEFAULT_WIDTH: number
  DEFAULT_HEIGHT: number
  DEFAULT_ITERATIONS: number
  MAX_ITERATIONS: number
  TIP_X_EPS: number

  /**
   * graphTypes are the graph types registered in functionPlot,
   * to register a new graphType use `registerGraphType`
   */
  graphTypes: { [key: string]: GraphTypeBuilder }
}

const Globals: TGlobals = {
  COLORS: [
    'steelblue',
    'red',
    '#05b378', // green
    'orange',
    '#4040e8', // purple
    'yellow',
    'brown',
    'magenta',
    'cyan'
  ].map(function (v) {
    return d3Hsl(v)
  }),
  DEFAULT_WIDTH: 550,
  DEFAULT_HEIGHT: 350,
  DEFAULT_ITERATIONS: null,
  TIP_X_EPS: 1,
  MAX_ITERATIONS: 0,
  graphTypes: {}
}

Globals.MAX_ITERATIONS = Globals.DEFAULT_WIDTH * 10

function registerGraphType(graphType: string, graphTypeBulder: GraphTypeBuilder) {
  if (Object.hasOwn(Globals.graphTypes, graphType)) {
    throw new Error(`registerGraphType: graphType ${graphType} is already registered.`)
  }
  Globals.graphTypes[graphType] = graphTypeBulder
}

export { registerGraphType }
export default Globals
