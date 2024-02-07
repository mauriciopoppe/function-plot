const config = {
  preset: 'jest-puppeteer',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '<rootDir>/{src,test}/**/?(*.)+(spec|test).[jt]s?(x)'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!d3-\\.*|internmap)']
}

module.exports = config
