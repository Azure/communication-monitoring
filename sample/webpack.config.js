const path = require('path');

module.exports = {
  watch: true,
  stats: 'verbose',
  mode: "development",
  entry: "./client.js",
  context: path.resolve(__dirname, '.'),
  output: {
    path:path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "inline-source-map",
  devServer: {
    publicPath: '/dist/',
    hot: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: [
        '/node_modules([\\]+|\/)+(?!callmonitorpackage)/'   
      ] 
    }
  }
}