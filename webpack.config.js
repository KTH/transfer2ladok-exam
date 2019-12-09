const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  context: path.resolve(__dirname, 'client'),
  entry: {
    index: ['./index.scss', './index.js']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: `${process.env.PROXY_PATH}/dist/`
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /.s[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
}
