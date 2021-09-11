const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')


const resolvePath = (_path) => {
  return path.resolve(__dirname, _path)
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: path.resolve(__dirname, './entry.js'),
  output: {
    path: path.resolve(__dirname, '../website-dist'),
    publicPath: '/',
    filename: isProd ? '[name].[hash].js' : '[name].js'
  },
  devServer: {
    contentBase: __dirname,
    hot: !isProd,
    publicPath: '/',
    open: true
  },
  resolve : {
    extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
    alias: {
      'pages': resolvePath('pages'),
      'utils': resolvePath('utils'),
      // 'components': 
      // 'enum':
    }
  },
  module: {
    rules: [
      {
        test: /.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './example/index.tpl',
      filename: './index.html'
    })
  ]
}