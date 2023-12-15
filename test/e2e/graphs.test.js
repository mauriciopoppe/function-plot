import puppeteer from 'puppeteer'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot })

const matchSnapshotConfig = {
  comparisonMethod: 'ssim',
  failureThreshold: 0.01,
  failureThresholdType: 'percent'
}

describe('Function Plot', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: 'new' })
    page = await browser.newPage()
    await page.setViewport({
      width: 1000,
      height: 1000,
      deviceScaleFactor: 2
    })
    await page.goto('http://localhost:4444/jest-function-plot.html')
  })

  it('should render an x^2 graph', async () => {
    await page.evaluate(`
functionPlot({
  target: '#playground',
  data: [
    { fn: 'x^2', graphType: 'polyline' }
  ]
})
    `)
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot(matchSnapshotConfig)
  })

  it('should render with additional options', async () => {
    await page.evaluate(`
functionPlot({
  target: '#playground',
  title: 'quadratic with options',
  width: 580,
  height: 400,
  disableZoom: true,
  xAxis: {
    label: 'x - axis',
    domain: [-6, 6]
  },
  yAxis: {
    label: 'y - axis'
  },
  data: [{
    fn: 'x^2'
  }]
})
    `)
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot(matchSnapshotConfig)
  })

  it('should render a grid', async () => {
    await page.evaluate(`
functionPlot({
  target: '#playground',
  xAxis: {
    label: 'real'
  },
  yAxis: {
    label: 'imaginary'
  },
  grid: true,
  data: [
    { fn: 'sqrt(1 - x * x)' },
    { fn: '-sqrt(1 - x * x)' }
  ]
})
    `)
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot(matchSnapshotConfig)
  })

  it('should render distinct domains', async () => {
    await page.evaluate(`
functionPlot({
  target: '#playground',
  yAxis: {domain: [-1, 1]},
  xAxis: {domain: [8, 24]},
  data: [{
    fn: 'sin(x)'
  }]
})
    `)
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot(matchSnapshotConfig)
  })

  it('should evaluate with multiple samples', async () => {
    await page.evaluate(`
functionPlot({
  target: '#playground',
  data: [{
    fn: 'sin(x)',
    nSamples: 1000
  }]
})
    `)
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot(matchSnapshotConfig)
  })

  it('should render annotations', async () => {
    await page.evaluate(`
functionPlot({
  target: '#playground',
  yAxis: {domain: [-1, 9]},
  data: [{
    fn: 'x^2'
  }],
  annotations: [{
    x: -1
  }, {
    x: 1,
    text: 'x = 1'
  }, {
    y: 2,
    text: 'y = 2'
  }]
})
    `)
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot(matchSnapshotConfig)
  })

  it('should render closed paths', async () => {
    await page.evaluate(`
functionPlot({
  target: '#playground',
  xAxis: {domain: [-2, 12]},
  data: [{
    fn: '3 + sin(x)',
    range: [2, 8],
    closed: true
  }]
})
    `)
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot(matchSnapshotConfig)
  })

  it('should render logarithmic scales', async () => {
    await page.evaluate(`
functionPlot({
  target: '#playground',
  xAxis: {
    type: 'log',
    domain: [0.01, 1]
  },
  yAxis: {
    domain: [-100, 100]
  },
  grid: true,
  data: [{
    fn: '1/x * cos(1/x)',
    // to make it look like a definite integral
    closed: true
  }]
})
    `)
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot(matchSnapshotConfig)
  })

  it('should render different graph types', async () => {
    await page.evaluate(`
functionPlot({
  target: '#playground',
  data: [{
    fn: '-sqrt(-x)',
    nSamples: 100,
    graphType: 'scatter'
  }, {
    fn: 'sqrt(x)',
    graphType: 'polyline'
  }, {
    fn: 'x^2',
    graphType: 'interval'
  }]
})
    `)
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot(matchSnapshotConfig)
  })
})
