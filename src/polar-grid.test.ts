import { describe, expect, it } from '@jest/globals'

import {
  formatPolarAngle,
  getPolarAngles,
  getPolarDomains,
  getPolarRadiusDomain,
  getPolarRadii,
  validatePolarOptions
} from './polar-grid'
import { PolarOptions } from './types'

describe('polar grid', () => {
  it('keeps equal units when adjusting domains to the viewport', () => {
    expect(getPolarDomains([-2, 2], [-2, 2], 400, 200)).toEqual({ xDomain: [-4, 4], yDomain: [-2, 2] })
  })

  it('finds visible radii when the origin is outside the viewport', () => {
    expect(getPolarRadiusDomain([3, 6], [4, 8])).toEqual([5, 10])
  })

  it('supports explicit and equally spaced ticks', () => {
    expect(getPolarRadii({ radialTicks: [1, 2, 2, 4] }, [0, 5])).toEqual([1, 2, 4])
    expect(getPolarAngles({ angularTicks: 4 })).toEqual([0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2])
    expect(getPolarAngles({ angularTicks: [0, 2 * Math.PI, -Math.PI, Math.PI] })).toEqual([0, Math.PI])
  })

  it('formats angles in radians and degrees', () => {
    expect(formatPolarAngle(Math.PI / 2, 'radians')).toBe('π/2')
    expect(formatPolarAngle(Math.PI, 'degrees')).toBe('180°')
  })

  it.each<PolarOptions>([
    { radiusDomain: [-1, 2] },
    { radiusDomain: [2, 1] },
    { radialTicks: 0 },
    { angularTicks: 1.5 },
    { radialTicks: [-1] },
    { angularTicks: [NaN] }
  ])('rejects invalid polar options %j', (polar) => {
    expect(() =>
      validatePolarOptions({ target: '#plot', xAxis: { type: 'linear' }, yAxis: { type: 'linear' }, polar })
    ).toThrow()
  })

  it('rejects logarithmic axes in polar mode', () => {
    expect(() => validatePolarOptions({ target: '#plot', xAxis: { type: 'log' }, yAxis: { type: 'linear' } })).toThrow(
      'linear axes'
    )
  })
})
