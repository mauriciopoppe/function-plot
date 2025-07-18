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
  resolver: 'ts-jest-resolver',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '<rootDir>/{src,test}/**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'node',
  globals: {
    __COMMIT_HASH__: 'unknown'
  },
  extensionsToTreatAsEsm: ['.ts']
}

module.exports = config
