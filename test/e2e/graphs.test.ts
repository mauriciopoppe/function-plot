import puppeteer from 'puppeteer'
import { expect, describe, it, beforeAll } from '@jest/globals'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

import { snippets } from './snippets'

expect.extend({ toMatchImageSnapshot })

const matchSnapshotConfig = {
  comparisonMethod: 'ssim',
  failureThreshold: 0.01,
  failureThresholdType: 'percent'
}

describe('Function Plot', () => {
  let page: any

  beforeAll(async () => {
    const browser = await puppeteer.launch({ headless: 'new' })
    page = await browser.newPage()
    await page.setViewport({
      width: 1000,
      height: 1000,
      deviceScaleFactor: 2
    })
    await page.goto('http://localhost:4444/jest-function-plot.html')
  })

  function stripWrappingFunction(fnString: string) {
    fnString = fnString.replace(/^\s*function\s*\(\)\s*\{/, '')
    fnString = fnString.replace(/\}\s*$/, '')
    return fnString
  }

  snippets.forEach((snippet) => {
    it(snippet.testName, async () => {
      await page.evaluate(stripWrappingFunction(snippet.fn.toString()))
      const image = await page.screenshot()
      // @ts-ignore
      expect(image).toMatchImageSnapshot(matchSnapshotConfig)
    })
  })
})
