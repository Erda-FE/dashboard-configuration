const path = require('path');
const webpack = require('webpack');

const vendors = [
  'react',
  'react-dom',
  'lodash',
  'moment',
  'immer',
];

module.exports = {
  entry: { vendor: vendors },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'dll.js',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'manifest.json'),
      name: '[name]_[hash]',
    }),
  ],
};

