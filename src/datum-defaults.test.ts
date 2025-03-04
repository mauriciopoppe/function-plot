import { describe, expect, it } from '@jest/globals'
import { FunctionPlotDatum } from './types.js'
import datumDefaults from '../src/datum-defaults.js'

describe('datumDefaults', () => {
  it('should assign a random ID if one is not provided', () => {
    const datum: FunctionPlotDatum = {}
    const result = datumDefaults(datum)
    expect(result.id).toBeDefined()
  })

  it('should default graphType to "interval" if not provided', () => {
    const datum: FunctionPlotDatum = {}
    const result = datumDefaults(datum)
    expect(result.graphType).toBe('interval')
  })

  it('should default sampler to "builtIn" if graphType is not "interval"', () => {
    const datum: FunctionPlotDatum = { graphType: 'polyline' }
    const result = datumDefaults(datum)
    expect(result.sampler).toBe('builtIn')
  })

  it('should default sampler to "interval" if graphType is "interval"', () => {
    const datum: FunctionPlotDatum = { graphType: 'interval' }
    const result = datumDefaults(datum)
    expect(result.sampler).toBe('interval')
  })

  it('should default fnType to "linear" if graphType is "polyline", "interval", or "scatter"', () => {
    let datum: FunctionPlotDatum = { graphType: 'polyline' }
    let result = datumDefaults(datum)
    expect(result.fnType).toBe('linear')

    datum = { graphType: 'interval' }
    result = datumDefaults(datum)
    expect(result.fnType).toBe('linear')

    datum = { graphType: 'scatter' }
    result = datumDefaults(datum)
    expect(result.fnType).toBe('linear')
  })

  it('should not modify the datum if all defaults are already set', () => {
    const datum: FunctionPlotDatum = {
      id: 'test',
      graphType: 'polyline',
      sampler: 'builtIn',
      fnType: 'linear'
    }
    const result = datumDefaults(datum)
    expect(result).toEqual(datum)
  })
})
