import { describe, expect, it } from '@jest/globals'

import {
  formatPolarAngle,
  getPolarAngles,
  getPolarDomains,
  getPolarLabelLayout,
  getPolarRayInterval,
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

  it('adjusts automatic radial ticks to the available pixels', () => {
    expect(getPolarRadii({}, [0, 3], 50)).toEqual([1, 2, 3])
    expect(getPolarRadii({}, [0, 3], 100)).toEqual([0.5, 1, 1.5, 2, 2.5, 3])
  })

  it('preserves explicit radial ticks regardless of the available pixels', () => {
    expect(getPolarRadii({ radialTicks: 5 }, [0, 3], 50)).toEqual([0.5, 1, 1.5, 2, 2.5, 3])
    expect(getPolarRadii({ radialTicks: [0.5, 1, 2, 3] }, [0, 3], 50)).toEqual([0.5, 1, 2, 3])
  })

  it('formats angles in radians and degrees', () => {
    expect(formatPolarAngle(Math.PI / 2, 'radians')).toBe('π/2')
    expect(formatPolarAngle(Math.PI, 'degrees')).toBe('180°')
  })

  it('uses the viewport edge for polar rays', () => {
    expect(getPolarRayInterval([50, 50], [1, 0], 100, 100)?.[1]).toBe(50)
    expect(getPolarRayInterval([50, 50], [Math.SQRT1_2, -Math.SQRT1_2], 100, 100)?.[1]).toBeCloseTo(70.7107)
  })

  it('only keeps ray directions that intersect the viewport', () => {
    expect(getPolarRayInterval([50, 150], [0, -1], 100, 100)).toEqual([50, 150])
    expect(getPolarRayInterval([50, 150], [0, 1], 100, 100)).toBeUndefined()
  })

  it('keeps labels on the outer visible ring', () => {
    const finite = getPolarLabelLayout([50, 50], [1, 0], [10, 20, 60], 100, 100)
    expect(finite.position).toEqual([70, 50])
    expect(finite.textAnchor).toBe('start')
    expect(getPolarLabelLayout([50, 150], [0, 1], [20], 100, 100)).toBeUndefined()
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
