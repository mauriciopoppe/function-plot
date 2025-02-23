import puppeteer, { Page } from 'puppeteer'
import { expect, describe, it, beforeAll } from '@jest/globals'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

import { snippets } from './snippets'

expect.extend({ toMatchImageSnapshot })

const matchSnapshotConfig = {
  comparisonMethod: 'ssim',
  failureThreshold: 0.01,
  failureThresholdType: 'percent'
}

async function getPage() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1000,
    height: 1000,
    deviceScaleFactor: 2
  })
  await page.goto('http://localhost:4444/jest-function-plot.html')
  return page
}

describe('Function Plot', () => {
  let page: Page
  beforeAll(async function () {
    page = await getPage()
  })

  function stripWrappingFunction(fnString: string) {
    fnString = fnString.replace(/^\s*function\s*\(\)\s*\{/, '')
    fnString = fnString.replace(/\}\s*$/, '')
    return fnString
  }

  snippets.forEach((snippet) => {
    it(snippet.testName, async () => {
      await page.evaluate(stripWrappingFunction(snippet.fn.toString()))
      // When a function that's evaluated asynchronously runs
      // it's possible that the rendering didn't happen yet.
      //
      // This adds an artificial spin only on functions that are labeled with [async]
      if (snippet.testName.indexOf('[async]') >= 0) {
        await new Promise((resolve) => {
          setTimeout(resolve, 100)
        })
      }

      const image = await page.screenshot({ encoding: 'base64' })
      // @ts-ignore
      expect(image).toMatchImageSnapshot(matchSnapshotConfig)
    })
  })

  it('update the graph using multiple renders', async () => {
    const firstRender = `
      const dualRender = {
        target: '#playground',
        data: [{ fn: 'x^2', graphType: 'polyline' }]
      }
      functionPlot(dualRender)
    `
    await page.evaluate(firstRender.toString())
    const firstImage = await page.screenshot({ encoding: 'base64' })
    // @ts-ignore
    expect(firstImage).toMatchImageSnapshot(matchSnapshotConfig)

    const secondRender = `
      dualRender.data[0].fn = 'x'
      functionPlot(dualRender)
    `
    await page.evaluate(secondRender.toString())
    const secondImage = await page.screenshot({ encoding: 'base64' })
    // @ts-ignore
    expect(secondImage).toMatchImageSnapshot(matchSnapshotConfig)
  })
})
