const path = require('path')
// Development plugins
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// Production plugins
const CssOptimizeAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const pathToBundle = path.resolve(__dirname, 'dist')

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  }
  if (isProd) {
    config.minimizer = [
      new TerserPlugin(),
      new CssOptimizeAssetsPlugin(),
    ]
  }
  return config
}

isDev ? console.log('isDev') : console.log('isProd')

const filename = extension => isDev ? `bundle.${extension}` :
     `bundle.[hash].${extension}`
const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    },
  }]
  if (isDev) loaders.push('eslint-loader')
  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  resolve: {
    extensions: ['.js', '.css'],
    alias: {
      '@styles': path.resolve(__dirname, 'src', 'scss'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    path: pathToBundle,
    filename: filename('js'),
  },
  entry: ['@babel/polyfill', './index.js'],
  optimization: optimization(),
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 4200,
    hot: isDev,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'favicon.ico'),
          to: pathToBundle,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: isDev,
            reloadAll: true,
          },
        },
        'css-loader',
        'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: jsLoaders(),
      },
    ],
  },

}
