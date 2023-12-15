const config = {
  preset: 'jest-puppeteer',
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!d3-\\.*|internmap)']
}

module.exports = config
