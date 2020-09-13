const path = require('path')

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'function-plot.js',
    library: 'functionPlot',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  devServer: {
    contentBase: './'
  }
}
