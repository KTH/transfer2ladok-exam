const webpackProd = require('./webpack.config')
const webpack = require('webpack')


module.exports = {
    ...webpackProd,
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {
        index: ['webpack-hot-middleware/client', ...webpackProd.entry.index],
        ...webpackProd.entry
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // Use NoErrorsPlugin for webpack 1.x
        new webpack.NoEmitOnErrorsPlugin(),
        ...webpackProd.plugins,
    ]
}