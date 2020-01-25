const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  return {
    mode: 'production',
    entry: './src/app.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/double-range/'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ]
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: 'styles.css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
    ]
  }
};
