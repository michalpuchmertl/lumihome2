const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: ['react-hot-loader/patch', './frontend/pages/Base/index.js'],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      appMountId: 'app',
      filename: 'index.html',
      template: './public/index.html',
    }),
    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  devServer: {
    contentBase: './public',
    historyApiFallback: true,
    hot: true,
    inline: true,
    host: 'localhost', // Defaults to `localhost`
    port: 3000,
    proxy: {
      '/api/*': 'http://[::1]:5000',
      // "secure": false,
      // "changeOrigin": true
    },
  },
};

module.exports = config;
