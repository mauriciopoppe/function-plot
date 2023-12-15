import puppeteer from 'puppeteer'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot })

describe('Function Plot', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: 'new' })
    page = await browser.newPage()
  })

  it('should render an x^2 graph', async () => {
    await page.goto('http://localhost:4444/jest-function-plot.html')
    await page.evaluate(`
functionPlot({
  target: '#playground',
  data: [
    { fn: 'x^2', graphType: 'polyline' }
  ]
})
    `)
    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot({
      failureThreshold: 0.01,
      failureThresholdType: 'percent'
    })
  })
})
