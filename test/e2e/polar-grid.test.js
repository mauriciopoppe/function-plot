const puppeteer = require('puppeteer')

describe('Polar coordinate system', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    page = await browser.newPage()
    await page.setViewport({ width: 1000, height: 1000 })
    await page.goto('http://localhost:4444/jest-function-plot.html')
  })

  it('keeps polar functions Cartesian by default', async () => {
    const result = await page.evaluate(() => {
      functionPlot({
        target: '#playground',
        data: [{ r: '2', fnType: 'polar', graphType: 'polyline' }]
      })
      return {
        polarGrid: document.querySelectorAll('.polar-grid').length,
        visibleAxes: Array.from(document.querySelectorAll('.axis')).every(
          (node) => getComputedStyle(node).display !== 'none'
        ),
        origins: document.querySelectorAll('.origin').length
      }
    })

    expect(result).toEqual({ polarGrid: 0, visibleAxes: true, origins: 2 })
  })

  afterAll(async () => {
    await browser?.close()
  })

  it('renders a true polar grid while preserving Cartesian defaults', async () => {
    const result = await page.evaluate(() => {
      functionPlot({
        target: '#playground',
        coordinateSystem: 'polar',
        polar: { radiusDomain: [0, 3], radialTicks: [1, 2, 3], angularTicks: 4, angularLabels: true },
        data: [{ r: '2 * sin(4 * theta)', fnType: 'polar', graphType: 'polyline' }]
      })
      const grid = document.querySelector('.polar-grid')
      const circle = grid.querySelector('circle.polar-grid-circle')
      const line = grid.querySelector('line.polar-grid-ray')
      return {
        circles: grid.querySelectorAll('.polar-grid-circle').length,
        rays: grid.querySelectorAll('.polar-grid-ray').length,
        labels: Array.from(grid.querySelectorAll('.polar-angle-label')).map((node) => node.textContent),
        equalRadius: Number(circle.getAttribute('r')),
        rayLength: Math.hypot(
          Number(line.getAttribute('x2')) - Number(line.getAttribute('x1')),
          Number(line.getAttribute('y2')) - Number(line.getAttribute('y1'))
        ),
        axesHidden: Array.from(document.querySelectorAll('.axis')).every(
          (node) => getComputedStyle(node).display === 'none'
        ),
        curve: !!document.querySelector('.graph path')?.getAttribute('d'),
        gridBeforeContent: !!(
          grid.compareDocumentPosition(document.querySelector('.content')) & Node.DOCUMENT_POSITION_FOLLOWING
        )
      }
    })

    expect(result.circles).toBe(3)
    expect(result.rays).toBe(4)
    expect(result.labels).toEqual(['0', 'π/2', 'π', '3π/2'])
    expect(result.equalRadius).toBeGreaterThan(0)
    expect(result.rayLength).toBeGreaterThan(0)
    expect(result.axesHidden).toBe(true)
    expect(result.curve).toBe(true)
    expect(result.gridBeforeContent).toBe(true)
  })

  it('places finite-grid angle labels beside the outer ring', async () => {
    const result = await page.evaluate(() => {
      functionPlot({
        target: '#playground',
        coordinateSystem: 'polar',
        polar: { radiusDomain: [0, 1], radialTicks: [1], angularTicks: 4, angularLabels: true },
        data: [{ r: '1', fnType: 'polar', graphType: 'polyline' }]
      })
      const grid = document.querySelector('.polar-grid')
      const circle = grid.querySelector('.polar-grid-circle')
      const zero = Array.from(grid.querySelectorAll('.polar-angle-label')).find((node) => node.textContent === '0')
      return {
        circleRight: Number(circle.getAttribute('cx')) + Number(circle.getAttribute('r')),
        labelX: Number(zero.getAttribute('x')),
        labelAnchor: zero.getAttribute('text-anchor'),
        clippedLines: grid.querySelector('.polar-grid-lines').getAttribute('clip-path'),
        labelsClipped: grid.getAttribute('clip-path')
      }
    })

    expect(result.labelX).toBeCloseTo(result.circleRight)
    expect(result.labelAnchor).toBe('start')
    expect(result.clippedLines).toContain('function-plot-clip-')
    expect(result.labelsClipped).toBeNull()
  })

  it('ends unbounded polar rays at the plot viewport', async () => {
    const result = await page.evaluate(() => {
      functionPlot({
        target: '#playground',
        coordinateSystem: 'polar',
        polar: { angularTicks: [0] },
        data: [{ r: '1', fnType: 'polar', graphType: 'polyline' }]
      })
      const ray = document.querySelector('.polar-grid-ray')
      const circle = document.querySelector('.polar-grid-circle')
      const clip = document.querySelector('.clip')
      return {
        rayEnd: Number(ray.getAttribute('x2')),
        viewportWidth: Number(clip.getAttribute('width')),
        circleExists: !!circle
      }
    })

    expect(result.rayEnd).toBe(result.viewportWidth)
    expect(result.circleExists).toBe(true)
  })

  it('hides angles whose rays are outside the viewport after panning', async () => {
    const result = await page.evaluate(() => {
      functionPlot({
        target: '#playground',
        coordinateSystem: 'polar',
        polar: { angularTicks: 4, angularLabels: true },
        xAxis: { domain: [-2, 2] },
        yAxis: { domain: [1, 5] },
        data: [{ r: '1', fnType: 'polar', graphType: 'polyline' }]
      })
      return {
        labels: Array.from(document.querySelectorAll('.polar-angle-label')).map((node) => node.textContent),
        rays: document.querySelectorAll('.polar-grid-ray').length
      }
    })

    expect(result.labels).toEqual(['π/2'])
    expect(result.rays).toBe(1)
  })

  it('hides angular labels by default', async () => {
    const result = await page.evaluate(() => {
      functionPlot({
        target: '#playground',
        coordinateSystem: 'polar',
        polar: { radialTicks: [1, 2], angularTicks: 4 },
        data: [{ r: '1', fnType: 'polar', graphType: 'polyline' }]
      })
      return document.querySelectorAll('.polar-angle-label').length
    })

    expect(result).toBe(0)
  })

  it('updates polar geometry after zoom and rejects logarithmic axes', async () => {
    await page.evaluate(() => {
      functionPlot({
        target: '#playground',
        coordinateSystem: 'polar',
        polar: { radiusDomain: [0, 3], radialTicks: [1, 2, 3], angularTicks: 4 },
        data: [{ r: '2', fnType: 'polar', graphType: 'polyline' }]
      })
    })
    const before = await page.$eval('.polar-grid-circle', (circle) => Number(circle.getAttribute('r')))
    await page.mouse.move(285, 175)
    await page.mouse.wheel({ deltaY: -200 })
    await page.waitForFunction(
      (radius) => Number(document.querySelector('.polar-grid-circle').getAttribute('r')) > radius,
      {},
      before
    )
    const after = await page.$eval('.polar-grid-circle', (circle) => Number(circle.getAttribute('r')))
    expect(after).toBeGreaterThan(before)

    const error = await page.evaluate(() => {
      try {
        functionPlot({ target: '#playground', coordinateSystem: 'polar', xAxis: { type: 'log' } })
      } catch (error) {
        return String(error)
      }
    })
    expect(error).toContain('polar coordinate system only supports linear axes')
  })
})
