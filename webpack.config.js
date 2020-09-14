const path = require('path')

module.exports = {
  entry: './src/index.js',
  mode: process.env.NODE_ENV === 'PROD' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'PROD' ? 'nosources-source-map' : 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'function-plot.js',
    library: 'functionPlot',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  devServer: {
    contentBase: './site'
  }
}
