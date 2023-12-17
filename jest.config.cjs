const puppeteerPreset = require('jest-puppeteer/jest-preset')

const config = {
  ...puppeteerPreset,
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!d3-\\.*|internmap)'],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts']
}

module.exports = config
