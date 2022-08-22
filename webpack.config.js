const path = require('path')

module.exports = {
  entry: './src/index.ts',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'function-plot.js',
    library: 'functionPlot',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  devServer: {
    contentBase: './site'
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
  }
}
