import { hsl as d3Hsl } from 'd3-color'

const Globals = {
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
  graphTypes: {},

  /** @type {null | any} */
  _workerPool: null,
  hasWorkerPool() {
    return this._workerPool !== null
  },
  get workerPool() {
    if (!this.hasWorkerPool()) {
      throw new Error('Failed to get web worker pool, did you forget to call withWebWorkers?')
    }
    return this._workerPool
  },
  set workerPool(workerPool) {
    this._workerPool = workerPool
  }
}

Globals.MAX_ITERATIONS = Globals.DEFAULT_WIDTH * 10

function registerGraphType(graphType, graphTypeBulder) {
  if (Object.hasOwn(Globals.graphTypes, graphType)) {
    throw new Error(`registerGraphType: graphType ${graphType} is already registered.`)
  }
  Globals.graphTypes[graphType] = graphTypeBulder
}

export { registerGraphType }
export default Globals
