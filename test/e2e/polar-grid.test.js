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

  beforeEach(async () => {
    await page.evaluate(() => {
      document.querySelector('#playground').innerHTML = ''
    })
  })

  afterAll(async () => {
    await browser?.close()
  })

  async function zoomAt(x = 0.5, y = 0.5) {
    const before = await page.evaluate(
      (x, y) => {
        const bounds = document.querySelector('.zoom-and-drag').getBoundingClientRect()
        const mouseX = Math.round(bounds.left + bounds.width * x)
        const mouseY = Math.round(bounds.top + bounds.height * y)
        return {
          scale: document.querySelector('.zoom-and-drag').__zoom.k,
          x: mouseX,
          y: mouseY,
          anchor: [mouseX - bounds.left, mouseY - bounds.top]
        }
      },
      x,
      y
    )
    await page.mouse.move(before.x, before.y)
    await page.mouse.wheel({ deltaY: -120 })
    // Wait for the wheel event's redraw instead of using a fixed delay.
    await page.waitForFunction((scale) => document.querySelector('.zoom-and-drag').__zoom.k > scale, {}, before.scale)
    return before.anchor
  }

  async function scaleState() {
    return page.evaluate(() => {
      const chart = window.polarChart
      const meta = chart.meta
      const transform = chart.draggable.node().__zoom
      return {
        x: meta.width / (meta.xScale.domain()[1] - meta.xScale.domain()[0]),
        y: meta.height / (meta.yScale.domain()[1] - meta.yScale.domain()[0]),
        domains: [meta.xScale.domain(), meta.yScale.domain()],
        origin: [meta.xScale(0), meta.yScale(0)],
        transform: { k: transform.k, x: transform.x, y: transform.y }
      }
    })
  }

  async function labelsInsideViewport(selector) {
    return page.$eval(
      'svg',
      (svg, selector) => {
        const viewport = svg.getBoundingClientRect()
        return Array.from(svg.querySelectorAll(selector)).map((node) => {
          const bounds = node.getBoundingClientRect()
          // SVG text coordinates can round by a fraction of a pixel at the viewport edge.
          return (
            bounds.width > 0 &&
            bounds.height > 0 &&
            bounds.left >= viewport.left - 0.01 &&
            bounds.right <= viewport.right + 0.01 &&
            bounds.top >= viewport.top - 0.01 &&
            bounds.bottom <= viewport.bottom + 0.01
          )
        })
      },
      selector
    )
  }

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

  it('renders polar layers and reuses their shared clip on rebuild', async () => {
    const result = await page.evaluate(() => {
      const options = () => ({
        target: '#playground',
        coordinateSystem: 'polar',
        polar: { radiusDomain: [0, 3], radialTicks: [1, 2, 3], angularTicks: 4, angularLabels: true },
        data: [{ r: '2 * sin(4 * theta)', fnType: 'polar', graphType: 'polyline' }]
      })
      functionPlot(options())
      const svg = document.querySelector('svg')
      svg.style.overflow = 'visible'
      functionPlot(options())
      const grid = document.querySelector('.polar-grid')
      const clip = grid.querySelector('.polar-grid-lines').getAttribute('clip-path')
      return {
        circles: grid.querySelectorAll('.polar-grid-circle').length,
        rays: grid.querySelectorAll('.polar-grid-ray').length,
        labels: Array.from(grid.querySelectorAll('.polar-angle-label')).map((node) => node.textContent),
        reusedSvg: svg === document.querySelector('svg'),
        clipExists: !!document.getElementById(clip.slice(5, -1)),
        sharedClip: clip === document.querySelector('.content').getAttribute('clip-path'),
        labelsUnclipped: grid.getAttribute('clip-path') === null,
        axesHidden: Array.from(document.querySelectorAll('.axis')).every(
          (node) => getComputedStyle(node).display === 'none'
        ),
        curve: !!document.querySelector('.graph path')?.getAttribute('d'),
        gridBeforeContent: !!(
          grid.compareDocumentPosition(document.querySelector('.content')) & Node.DOCUMENT_POSITION_FOLLOWING
        )
      }
    })

    expect(result).toEqual({
      circles: 3,
      rays: 4,
      labels: ['0', 'π/2', 'π', '3π/2'],
      reusedSvg: true,
      clipExists: true,
      sharedClip: true,
      labelsUnclipped: true,
      axesHidden: true,
      curve: true,
      gridBeforeContent: true
    })
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
      const clip = document.querySelector('.clip')
      return {
        rayEnd: Number(ray.getAttribute('x2')),
        viewportWidth: Number(clip.getAttribute('width'))
      }
    })

    expect(result.rayEnd).toBe(result.viewportWidth)
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

  it.each([false, true])(
    'preserves polar scales after resizing and zooming (previous zoom: %s)',
    async (previousZoom) => {
      await page.evaluate(() => {
        window.polarOptions = {
          target: '#playground',
          width: 400,
          height: 400,
          coordinateSystem: 'polar',
          polar: { radiusDomain: [0, 3], radialTicks: [2] },
          data: [{ r: '2', fnType: 'polar', graphType: 'polyline' }]
        }
        window.polarChart = functionPlot(window.polarOptions)
      })
      if (previousZoom) await zoomAt(0.25, 0.25)
      const before = await scaleState()
      await page.evaluate(() => {
        window.polarOptions.width = 800
        window.polarChart = functionPlot(window.polarOptions)
      })
      const resized = await scaleState()
      expect(resized.transform).toEqual(before.transform)
      expect(resized.x).toBeCloseTo(resized.y)

      await zoomAt()
      const zoomed = await scaleState()
      const factor = zoomed.transform.k / resized.transform.k
      expect(zoomed.x).toBeCloseTo(zoomed.y)
      expect(zoomed.x / resized.x).toBeCloseTo(factor)
      const geometry = await page.evaluate(() => {
        const curve = document.querySelector('.graph path').getBBox()
        const circle = document.querySelector('.polar-grid-circle').getBBox()
        return { curveWidth: curve.width, curveHeight: curve.height, diameter: circle.width }
      })
      expect(geometry.curveWidth).toBeCloseTo(geometry.diameter, 1)
      expect(geometry.curveHeight).toBeCloseTo(geometry.diameter, 1)
    }
  )

  it.each([
    ['cartesian', true],
    ['polar', true],
    ['cartesian', false],
    ['polar', false]
  ])('preserves zoom when switching from %s (reuse options: %s)', async (coordinateSystem, reuseOptions) => {
    await page.evaluate((coordinateSystem) => {
      window.polarOptions = {
        target: '#playground',
        width: 550,
        height: 350,
        coordinateSystem,
        data: [{ fn: 'x', graphType: 'polyline' }]
      }
      window.polarChart = functionPlot(window.polarOptions)
    }, coordinateSystem)
    await zoomAt(0.25, 0.25)

    for (const mode of [coordinateSystem === 'polar' ? 'cartesian' : 'polar', coordinateSystem]) {
      const previous = await scaleState()
      await page.evaluate(
        (mode, reuseOptions) => {
          const previous = window.polarOptions
          // New options omit internal metadata while reusing the previous SVG.
          const options = reuseOptions
            ? previous
            : {
                target: previous.target,
                width: previous.width,
                height: previous.height,
                xAxis: previous.xAxis,
                yAxis: previous.yAxis,
                data: previous.data
              }
          options.coordinateSystem = mode
          window.polarOptions = options
          window.polarChart = functionPlot(options)
        },
        mode,
        reuseOptions
      )
      const rebuilt = await scaleState()
      expect(rebuilt.transform).toEqual(previous.transform)

      // Applying the same transform must leave the rebuilt viewport unchanged.
      await page.evaluate(() => {
        const chart = window.polarChart
        chart.emit('zoom', { transform: chart.draggable.node().__zoom })
        chart.draw()
      })
      const unchanged = await scaleState()
      for (const axis of [0, 1]) {
        for (const bound of [0, 1]) {
          expect(unchanged.domains[axis][bound]).toBeCloseTo(rebuilt.domains[axis][bound], 10)
        }
      }

      const anchor = await zoomAt(0.25, 0.25)
      const zoomed = await scaleState()
      const factor = zoomed.transform.k / rebuilt.transform.k
      expect(zoomed.x / rebuilt.x).toBeCloseTo(factor)
      expect(zoomed.y / rebuilt.y).toBeCloseTo(factor)
      for (const axis of [0, 1]) {
        expect(zoomed.origin[axis]).toBeCloseTo(anchor[axis] + (rebuilt.origin[axis] - anchor[axis]) * factor)
      }
    }
  })

  it.each(['cartesian', 'polar'])('keeps the title and hover legend inside the %s SVG', async (coordinateSystem) => {
    await page.evaluate((coordinateSystem) => {
      const options = {
        target: '#playground',
        width: 400,
        height: 400,
        coordinateSystem,
        title: 'Plot title',
        polar: { radiusDomain: [0, 3] },
        data: [{ fn: 'x', graphType: 'polyline', title: 'line' }]
      }
      functionPlot(options)
      const chart = functionPlot(options)
      chart.tip.move({ x: 1, y: 1 })
    }, coordinateSystem)
    expect(await labelsInsideViewport('.title, .top-right-legend')).toEqual([true, true])
  })

  it.each([false, true])("fits angle labels on each ray's outermost ring (custom format: %s)", async (customFormat) => {
    const result = await page.evaluate((customFormat) => {
      functionPlot({
        target: '#playground',
        width: 600,
        height: 400,
        coordinateSystem: 'polar',
        xAxis: { domain: [-3, 3] },
        yAxis: { domain: [-2, 2] },
        polar: {
          radialTicks: [1, 2, 3],
          angularTicks: 4,
          angularLabels: true,
          angleTickFormat: customFormat ? (angle) => `angle = ${angle.toFixed(2)}` : undefined
        },
        data: []
      })
      // The horizontal ray reaches ring 3; the vertical ray only reaches ring 2.
      const labels = document.querySelectorAll('.polar-angle-label')
      return { zeroX: Number(labels[0].getAttribute('x')), halfPiY: Number(labels[1].getAttribute('y')) }
    }, customFormat)
    expect(result.zeroX).toBeCloseTo(600)
    expect(result.halfPiY).toBeCloseTo(0)
    expect(await labelsInsideViewport('.polar-angle-label')).toEqual([true, true, true, true])
  })

  it('rejects logarithmic axes in polar mode', async () => {
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
