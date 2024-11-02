import { FunctionPlotDatum } from './types.js'

export default function datumDefaults(d: FunctionPlotDatum): FunctionPlotDatum {
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
