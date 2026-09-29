import { format as d3Format } from 'd3-format'
import { scaleLinear as d3ScaleLinear } from 'd3-scale'
import type { FunctionPlotOptions, PolarOptions } from './types'
import type { ChartMeta } from './chart'

const TWO_PI = 2 * Math.PI
const DEFAULT_POLAR_ANGLE_UNIT = 'radians'

export function validatePolarOptions(options: FunctionPlotOptions) {
  if (options.xAxis.type !== 'linear' || options.yAxis.type !== 'linear') {
    throw new Error('polar coordinate system only supports linear axes')
  }

  for (const domain of [options.xAxis.domain, options.yAxis.domain, options.polar?.radiusDomain]) {
    if (domain && (domain.length !== 2 || domain.some((value) => !Number.isFinite(value)) || domain[0] >= domain[1])) {
      throw new Error('polar domains must contain two finite ascending values')
    }
  }

  const polar = options.polar
  if (polar?.radiusDomain?.[0] < 0) {
    throw new Error('polar radiusDomain must be non-negative')
  }

  for (const ticks of [polar?.radialTicks, polar?.angularTicks]) {
    if (ticks !== undefined && !Array.isArray(ticks) && (!Number.isInteger(ticks) || ticks < 1)) {
      throw new Error('polar tick counts must be positive integers')
    }
    if (Array.isArray(ticks) && ticks.some((value) => !Number.isFinite(value))) {
      throw new Error('polar tick values must be finite numbers')
    }
  }

  if (Array.isArray(polar?.radialTicks) && polar.radialTicks.some((value) => value < 0)) {
    throw new Error('polar radial ticks must be non-negative')
  }
  if (polar?.angleUnit && polar.angleUnit !== 'radians' && polar.angleUnit !== 'degrees') {
    throw new Error(`unsupported polar angle unit ${polar.angleUnit}`)
  }
}

export function getPolarDomains(xDomain: number[], yDomain: number[], width: number, height: number) {
  const unitsPerPixel = Math.max((xDomain[1] - xDomain[0]) / width, (yDomain[1] - yDomain[0]) / height)
  const xCenter = (xDomain[0] + xDomain[1]) / 2
  const yCenter = (yDomain[0] + yDomain[1]) / 2
  return {
    xDomain: [xCenter - (width * unitsPerPixel) / 2, xCenter + (width * unitsPerPixel) / 2],
    yDomain: [yCenter - (height * unitsPerPixel) / 2, yCenter + (height * unitsPerPixel) / 2]
  }
}

export function getPolarRadiusDomain(xDomain: number[], yDomain: number[]): [number, number] {
  const xMin = Math.min(...xDomain)
  const xMax = Math.max(...xDomain)
  const yMin = Math.min(...yDomain)
  const yMax = Math.max(...yDomain)
  const nearestX = Math.max(xMin, Math.min(0, xMax))
  const nearestY = Math.max(yMin, Math.min(0, yMax))
  return [
    Math.hypot(nearestX, nearestY),
    Math.hypot(Math.max(Math.abs(xMin), Math.abs(xMax)), Math.max(Math.abs(yMin), Math.abs(yMax)))
  ]
}

export function getPolarRadii(polar: PolarOptions, visibleDomain: [number, number]) {
  const radiusDomain = polar.radiusDomain || visibleDomain
  const minimum = Math.max(radiusDomain[0], visibleDomain[0])
  const maximum = Math.min(radiusDomain[1], visibleDomain[1])
  if (minimum > maximum) return []
  const values: number[] = Array.isArray(polar.radialTicks)
    ? polar.radialTicks
    : d3ScaleLinear()
        .domain([minimum, maximum])
        .ticks(polar.radialTicks || 5)
  return Array.from(new Set(values))
    .filter((value) => value > 0 && value >= minimum && value <= maximum)
    .sort((first, second) => first - second)
}

export function getPolarAngles(polar: PolarOptions) {
  if (Array.isArray(polar.angularTicks)) {
    const normalized = polar.angularTicks.map((angle) => ((angle % TWO_PI) + TWO_PI) % TWO_PI)
    return normalized.filter(
      (angle, index) => normalized.findIndex((other) => Math.abs(other - angle) < 1e-10) === index
    )
  }
  const count = polar.angularTicks || 12
  return Array.from({ length: count }, (_, index) => (index * TWO_PI) / count)
}

export function formatPolarAngle(angle: number, unit: 'radians' | 'degrees') {
  if (unit === 'degrees') return `${Number(((angle * 180) / Math.PI).toFixed(2))}°`
  for (const denominator of [1, 2, 3, 4, 6, 8, 12, 16]) {
    const numerator = Math.round((angle / Math.PI) * denominator)
    if (Math.abs(angle / Math.PI - numerator / denominator) < 1e-10) {
      if (numerator === 0) return '0'
      const prefix = numerator === 1 ? '' : numerator === -1 ? '-' : String(numerator)
      return `${prefix}π${denominator === 1 ? '' : `/${denominator}`}`
    }
  }
  return Number(angle.toFixed(3)).toString()
}

export function getPolarRayInterval(
  center: [number, number],
  direction: [number, number],
  width: number,
  height: number
) {
  let minimum = -Infinity
  let maximum = Infinity
  for (const [origin, delta, extent] of [
    [center[0], direction[0], width],
    [center[1], direction[1], height]
  ]) {
    if (Math.abs(delta) < 1e-10) {
      if (origin < 0 || origin > extent) return undefined
      continue
    }
    const first = (0 - origin) / delta
    const second = (extent - origin) / delta
    minimum = Math.max(minimum, Math.min(first, second))
    maximum = Math.min(maximum, Math.max(first, second))
  }
  const start = Math.max(0, minimum)
  return maximum > start ? [start, maximum] : undefined
}

export function getPolarLabelLayout(
  center: [number, number],
  direction: [number, number],
  radius: number,
  width: number,
  height: number
) {
  const interval = getPolarRayInterval(center, direction, width, height)
  if (!interval || radius < interval[0]) return undefined
  const labelRadius = Math.min(radius, interval[1])
  const position: [number, number] = [center[0] + direction[0] * labelRadius, center[1] + direction[1] * labelRadius]
  const textAnchor = direction[0] > 1e-10 ? 'start' : direction[0] < -1e-10 ? 'end' : 'middle'
  return { position, textAnchor }
}

export function renderPolarGrid(canvas: any, meta: ChartMeta, options: FunctionPlotOptions, clipId: string) {
  const enabled = options.coordinateSystem === 'polar' && options.polar?.grid !== false
  const selection = canvas.selectAll('g.polar-grid').data(enabled ? [options.polar || {}] : [])
  selection.exit().remove()
  if (!enabled) return

  const grid = selection
    .merge(selection.enter().insert('g', '.content, .zoom-and-drag').attr('class', 'polar-grid'))
    .attr('clip-path', null)
    .attr('pointer-events', 'none')
  const clippedGrid = grid.selectAll(':scope > g.polar-grid-lines').data([0])
  const clippedGridEnter = clippedGrid.enter().append('g').attr('class', 'polar-grid-lines')
  const lines = clippedGrid.merge(clippedGridEnter).attr('clip-path', 'url(#' + clipId + ')')
  const polar = options.polar || {}
  const xScale = meta.xScale
  const yScale = meta.yScale
  const visibleDomain = getPolarRadiusDomain(xScale.domain(), yScale.domain())
  const radii = getPolarRadii(polar, visibleDomain)
  const angles = getPolarAngles(polar)
  const radius = polar.radiusDomain?.[1] === undefined ? undefined : Math.min(polar.radiusDomain[1], visibleDomain[1])
  const center: [number, number] = [xScale(0), yScale(0)]
  const xUnit = xScale(1) - center[0]
  const yUnit = yScale(1) - center[1]
  const pixelsPerUnit = Math.abs(xUnit)
  const getRayGeometry = (angle: number) => {
    const direction: [number, number] = [Math.cos(angle) * Math.sign(xUnit), Math.sin(angle) * Math.sign(yUnit)]
    const interval = getPolarRayInterval(center, direction, meta.width, meta.height)
    if (!interval) return undefined
    const rayLength = radius === undefined ? interval[1] : Math.min(radius * pixelsPerUnit, interval[1])
    return rayLength > interval[0] ? { direction, rayLength } : undefined
  }
  const visibleAngles = angles.filter((angle) => getRayGeometry(angle))

  const circles = lines.selectAll('circle.polar-grid-circle').data(radii, (value: number) => value)
  circles.exit().remove()
  circles
    .merge(circles.enter().append('circle').attr('class', 'polar-grid-circle'))
    .attr('cx', center[0])
    .attr('cy', center[1])
    .attr('r', (value: number) => value * pixelsPerUnit)
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('opacity', 0.2)

  const rays = lines.selectAll('line.polar-grid-ray').data(visibleAngles, (value: number) => value)
  rays.exit().remove()
  rays
    .merge(rays.enter().append('line').attr('class', 'polar-grid-ray'))
    .attr('x1', center[0])
    .attr('y1', center[1])
    .attr('x2', (angle: number) => {
      const ray = getRayGeometry(angle)
      return center[0] + ray.direction[0] * ray.rayLength
    })
    .attr('y2', (angle: number) => {
      const ray = getRayGeometry(angle)
      return center[1] + ray.direction[1] * ray.rayLength
    })
    .attr('stroke', 'currentColor')
    .attr('opacity', 0.2)

  const radiusLabels = grid.selectAll('text.polar-radius-label').data(radii, (value: number) => value)
  radiusLabels.exit().remove()
  radiusLabels
    .merge(radiusLabels.enter().append('text').attr('class', 'polar-radius-label'))
    .attr('x', (value: number) => xScale(value))
    .attr('y', center[1])
    .attr('dx', 4)
    .attr('dy', -5)
    .attr('fill', 'currentColor')
    .attr('opacity', 0.6)
    .text(polar.radiusTickFormat || d3Format('~g'))

  const labels =
    polar.angularLabels && radii.length
      ? visibleAngles.reduce((result: any[], angle: number) => {
          const direction: [number, number] = [Math.cos(angle) * Math.sign(xUnit), Math.sin(angle) * Math.sign(yUnit)]
          const interval = getPolarRayInterval(center, direction, meta.width, meta.height)
          const labelRadius = interval ? radii.filter((value) => value * pixelsPerUnit <= interval[1]).pop() : undefined
          const layout =
            labelRadius === undefined
              ? undefined
              : getPolarLabelLayout(center, direction, labelRadius * pixelsPerUnit, meta.width, meta.height)
          if (layout) result.push({ angle, ...layout })
          return result
        }, [])
      : []
  const angleLabels = grid.selectAll('text.polar-angle-label').data(labels, (value: any) => value.angle)
  angleLabels.exit().remove()
  angleLabels
    .merge(angleLabels.enter().append('text').attr('class', 'polar-angle-label'))
    .attr('x', (value: any) => value.position[0])
    .attr('y', (value: any) => value.position[1])
    .attr('text-anchor', (value: any) => value.textAnchor)
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'currentColor')
    .attr('opacity', 0.6)
    .text((value: any) => {
      const unit = polar.angleUnit || DEFAULT_POLAR_ANGLE_UNIT
      const angle = unit === 'degrees' ? (value.angle * 180) / Math.PI : value.angle
      return polar.angleTickFormat ? polar.angleTickFormat(angle) : formatPolarAngle(value.angle, unit)
    })
}
