const path = require('path');
const webpackConfig = require('./webpack.config');

const frontUrl = '127.0.0.1';

const devServer = {
  port: 8010,
  // host: frontUrl,
  compress: true,
  contentBase: path.join(__dirname, 'public'),
  index: 'index.html',
  open: true,
  noInfo: false,
  progress: false,
  historyApiFallback: true,
  watchContentBase: true,
  allowedHosts: [
    frontUrl,
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
};

module.exports = {
  ...webpackConfig(),
  devServer,
};
