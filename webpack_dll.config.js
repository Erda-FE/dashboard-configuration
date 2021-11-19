const path = require('path');
const webpack = require('webpack');

const vendors = ['react', 'react-dom', 'lodash', 'moment', 'immer', 'echarts', 'echarts-for-react'];

/** @type { import('webpack').Configuration } */
module.exports = {
  entry: { vendor: vendors },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'dll.js',
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'manifest.json'),
      context: __dirname,
      name: '[name]',
    }),
  ],
};
