const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  context: path.resolve(__dirname, 'client'),
  entry: {
    main: './index.js'
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: `${process.env.PROXY_PATH}/dist/`
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
}
