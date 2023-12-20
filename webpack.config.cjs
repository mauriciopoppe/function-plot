const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './src/index.ts',
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'nosources-source-map' : 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'function-plot.js',
    chunkFilename: '[name].function-plot.js',
    library: 'functionPlot',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  devServer: {
    static: './site'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  optimization: {
    minimize: false
  }
}
