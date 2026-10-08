import { format as d3Format } from 'd3-format'
import { scaleLinear as d3ScaleLinear } from 'd3-scale'
import { select as d3Select } from 'd3-selection'
import type { FunctionPlotOptions, PolarOptions } from './types'
import type { ChartMeta } from './chart'

const TWO_PI = 2 * Math.PI
const DEFAULT_POLAR_ANGLE_UNIT = 'radians'

/** Reject domains, ticks and axis types that cannot define a polar grid. */
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

/** Expand the narrower domain around its center so both axes use the same units per pixel. */
export function getPolarDomains(xDomain: number[], yDomain: number[], width: number, height: number) {
  const unitsPerPixel = Math.max((xDomain[1] - xDomain[0]) / width, (yDomain[1] - yDomain[0]) / height)
  const xCenter = (xDomain[0] + xDomain[1]) / 2
  const yCenter = (yDomain[0] + yDomain[1]) / 2
  return {
    xDomain: [xCenter - (width * unitsPerPixel) / 2, xCenter + (width * unitsPerPixel) / 2],
    yDomain: [yCenter - (height * unitsPerPixel) / 2, yCenter + (height * unitsPerPixel) / 2]
  }
}

/** Find the nearest and farthest distances from the origin to a rectangular viewport. */
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

/**
 * Select radial ticks inside the configured and visible radius bounds.
 * Automatic ticks target roughly 50 pixels of spacing; explicit ticks take precedence.
 */
export function getPolarRadii(polar: PolarOptions, visibleDomain: [number, number], pixelsPerUnit?: number) {
  const radiusDomain = polar.radiusDomain || visibleDomain
  const minimum = Math.max(radiusDomain[0], visibleDomain[0])
  const maximum = Math.min(radiusDomain[1], visibleDomain[1])
  if (minimum > maximum) return []
  let values: number[]
  if (Array.isArray(polar.radialTicks)) {
    values = polar.radialTicks
  } else {
    let tickCount = polar.radialTicks || 5
    if (polar.radialTicks === undefined && pixelsPerUnit !== undefined) {
      const pixelRange = (maximum - minimum) * pixelsPerUnit
      tickCount = Math.max(1, Math.round(pixelRange / 50))
    }
    values = d3ScaleLinear().domain([minimum, maximum]).ticks(tickCount)
  }
  return Array.from(new Set(values))
    .filter((value) => value > 0 && value >= minimum && value <= maximum)
    .sort((first, second) => first - second)
}

/** Normalize explicit angles or distribute a tick count over one revolution. */
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

/** Format common multiples of pi as fractions, falling back to decimal radians. */
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

/**
 * Intersect a ray from center with the viewport rectangle. For each axis,
 * solve 0 <= center + direction * distance <= extent, then intersect the two
 * distance intervals with distance >= 0.
 *
 *       +---------+  viewport
 *       |    /    |
 *       |   /     |  ray enters at start and leaves at end
 *       +--/------+
 *         center
 */
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

/** Select the outermost visible ring from ascending pixel radii and anchor its label away from the ray. */
export function getPolarLabelLayout(
  center: [number, number],
  direction: [number, number],
  radii: number[],
  width: number,
  height: number
) {
  const interval = getPolarRayInterval(center, direction, width, height)
  if (!interval) return undefined
  const radius = radii.filter((value) => value >= interval[0] && value <= interval[1]).pop()
  if (radius === undefined) return undefined
  const position: [number, number] = [center[0] + direction[0] * radius, center[1] + direction[1] * radius]
  const textAnchor = direction[0] > 1e-10 ? 'start' : direction[0] < -1e-10 ? 'end' : 'middle'
  return { position, textAnchor }
}

/** Render clipped circles/rays, with angular labels fitted inside the SVG viewport. */
export function renderPolarGrid(canvas: any, meta: ChartMeta, options: FunctionPlotOptions) {
  const enabled = options.coordinateSystem === 'polar' && options.polar?.grid !== false
  if (!enabled) {
    canvas.selectAll('g.polar-grid').remove()
    return
  }

  // Join the grid before plotted content; only the lines need the plot clip.
  const selection = canvas.selectAll('g.polar-grid').data([options.polar || {}])
  const grid = selection
    .merge(selection.enter().insert('g', '.content, .zoom-and-drag').attr('class', 'polar-grid'))
    .attr('clip-path', null)
    .attr('pointer-events', 'none')
  const clippedGrid = grid.selectAll(':scope > g.polar-grid-lines').data([0])
  const clippedGridEnter = clippedGrid.enter().append('g').attr('class', 'polar-grid-lines')
  // Reuse the SVG's plot clip, which can outlive the Chart instance that created it.
  const clipId = canvas.select('clipPath[id]').attr('id')
  const lines = clippedGrid.merge(clippedGridEnter).attr('clip-path', 'url(#' + clipId + ')')
  const polar = options.polar || {}
  const xScale = meta.xScale
  const yScale = meta.yScale
  const visibleDomain = getPolarRadiusDomain(xScale.domain(), yScale.domain())
  const center: [number, number] = [xScale(0), yScale(0)]
  const xUnit = xScale(1) - center[0]
  const yUnit = yScale(1) - center[1]
  const pixelsPerUnit = Math.abs(xUnit)
  const radii = getPolarRadii(polar, visibleDomain, pixelsPerUnit)
  const angles = getPolarAngles(polar)
  const getRayGeometry = (angle: number) => {
    const radius = polar.radiusDomain?.[1] === undefined ? undefined : Math.min(polar.radiusDomain[1], visibleDomain[1])
    const direction: [number, number] = [Math.cos(angle) * Math.sign(xUnit), Math.sin(angle) * Math.sign(yUnit)]
    const interval = getPolarRayInterval(center, direction, meta.width, meta.height)
    if (!interval) return undefined
    const rayLength = radius === undefined ? interval[1] : Math.min(radius * pixelsPerUnit, interval[1])
    return rayLength > interval[0] ? { direction, rayLength } : undefined
  }
  const visibleAngles = angles.filter((angle) => getRayGeometry(angle))

  // Circle and ray joins stay inside the clipped grid group.
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

  // Labels join the outer group so their text can extend beyond the plot clip.
  const radiusLabels = grid.selectAll('text.polar-radius-label').data(radii, (value: number) => value)
  radiusLabels.exit().remove()
  radiusLabels
    .merge(radiusLabels.enter().append('text').attr('class', 'polar-radius-label'))
    .attr('x', (value: number) => xScale(value))
    .attr('y', center[1])
    .attr('text-anchor', 'middle')
    .attr('dy', '-0.8em')
    .attr('fill', 'currentColor')
    .text(polar.radiusTickFormat || d3Format('~g'))

  const labels: any[] = []
  if (polar.angularLabels && radii.length) {
    const pixelRadii = radii.map((value) => value * pixelsPerUnit)
    for (const angle of visibleAngles) {
      const direction: [number, number] = [Math.cos(angle) * Math.sign(xUnit), Math.sin(angle) * Math.sign(yUnit)]
      const layout = getPolarLabelLayout(center, direction, pixelRadii, meta.width, meta.height)
      if (layout) labels.push({ angle, direction, ...layout })
    }
  }
  const angleLabels = grid.selectAll('text.polar-angle-label').data(labels, (value: any) => value.angle)
  angleLabels.exit().remove()
  angleLabels
    .merge(angleLabels.enter().append('text').attr('class', 'polar-angle-label'))
    .attr('x', (value: any) => value.position[0])
    .attr('y', (value: any) => value.position[1])
    .attr('dx', (value: any) => value.direction[0] * 8)
    .attr('dy', (value: any) => value.direction[1] * 8)
    .attr('text-anchor', (value: any) => value.textAnchor)
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'currentColor')
    .text((value: any) => {
      const unit = polar.angleUnit || DEFAULT_POLAR_ANGLE_UNIT
      const angle = unit === 'degrees' ? (value.angle * 180) / Math.PI : value.angle
      return polar.angleTickFormat ? polar.angleTickFormat(angle) : formatPolarAngle(value.angle, unit)
    })
    .each(function (this: SVGTextElement, value: any) {
      // Keep the chosen ring anchor, adjusting only text that crosses the SVG viewport.
      const bounds = this.getBBox()
      const dx = Math.max(0, -bounds.x) - Math.max(0, bounds.x + bounds.width - meta.width)
      const dy = Math.max(0, -bounds.y) - Math.max(0, bounds.y + bounds.height - meta.height)
      d3Select(this)
        .attr('dx', value.direction[0] * 8 + dx)
        .attr('dy', value.direction[1] * 8 + dy)
    })
}
