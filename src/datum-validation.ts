import { FunctionPlotDatum } from './types.js'
import { assert } from './utils.mjs'

export default function datumValidation(d: FunctionPlotDatum) {
  validateGraphType(d)
  validateFnType(d)
}

function validateGraphType(d: FunctionPlotDatum) {
  // defaulted to 'interval' in datumDefaults.
  assert('graphType' in d, `graphType isn't defined`)
}

function validateFnType(d: FunctionPlotDatum) {
  const invalid = `invalid option fnType=${d.fnType} with graphType=${d.graphType}`
  if (d.fnType === 'linear') {
    assert(d.graphType === 'polyline' || d.graphType === 'interval' || d.graphType === 'scatter', invalid)
  }
  if (d.fnType === 'parametric' || d.fnType === 'polar' || d.fnType === 'vector') {
    assert(d.graphType === 'polyline', invalid)
  }
  if (d.fnType === 'points') {
    assert(d.graphType === 'polyline' || d.graphType === 'scatter', invalid)
  }
  if (d.fnType === 'implicit') {
    assert(d.graphType === 'interval', invalid)
  }
}
