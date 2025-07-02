import type { FunctionPlotDatum } from './types.js'
import { randomId } from './utils.mjs'

export default function datumDefaults(d: FunctionPlotDatum): FunctionPlotDatum {
  if (!('id' in d)) {
    d.id = randomId()
  }

  // default graphType uses boxes i.e. 2d intervals
  if (!('graphType' in d)) {
    d.graphType = 'interval'
  }

  // if the graphType is not `interval` then the sampler is `builtIn`
  // because the interval sampler returns a box instead of a point
  if (!('sampler' in d)) {
    d.sampler = d.graphType !== 'interval' ? 'builtIn' : 'interval'
  }

  if (!('fnType' in d) && (d.graphType == 'polyline' || d.graphType == 'interval' || d.graphType == 'scatter')) {
    d.fnType = 'linear'
  }

  return d
}
