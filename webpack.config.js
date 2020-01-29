const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return {
    mode: 'development',
    entry: './src/app.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ]
        }
      ]
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9001
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Shop admin page',
        filename: 'index.html',
        template: 'src/index-tmpl.html'
      }),
    ]
  }
};
