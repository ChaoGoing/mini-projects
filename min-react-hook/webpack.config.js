const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    main: './main.js',
  },
  module:{
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            ['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }]
          ]
        }
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './index.html'),
    })
  ],
  mode: 'development',
  optimization: {
    minimize: false
  },
  devServer:{
    host: '127.0.0.1',
    port: 8090,
  }
}