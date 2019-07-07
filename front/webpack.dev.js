const merge = require('webpack-merge')
const common = require('./webpack.common.js')
var path = require('path')

module.exports = merge(common, {
  mode: 'development',
  output : {
      path : path.resolve(__dirname , 'dist'),
      filename: 'scorebase.bundle.js',
      publicPath: '/'
  },
  devServer: {
      historyApiFallback: true,
  },
})
