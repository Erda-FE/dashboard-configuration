const path = require('path');
const webpack = require('webpack');

const vendors = [
  'react',
  'react-dom',
  'lodash',
  'moment',
  '@terminus/nusi',
  'immer',
];

module.exports = {
  entry: { vendor: vendors },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'dll.js',
    library: '[name]_[hash]',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'manifest.json'),
      name: '[name]_[hash]',
      context: __dirname,
    }),
  ],
};

