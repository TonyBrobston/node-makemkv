const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  target: 'node',
  entry: ['babel-polyfill', 'whatwg-fetch', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
              presets: ['env', 'react']
          }
        }
    },
    {
        test: /\.css$/,
        use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
        ]
    }
    ]
  },
  plugins: [
      new CopyWebpackPlugin([
          {
              from: 'src/static/',
              to: 'static/'
          }
      ])
  ]
};
