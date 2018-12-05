const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Visualizer = require('webpack-visualizer-plugin');
const defaultConfig = require('./webpack.config');

const webpackConfig = { ...defaultConfig() };
webpackConfig.plugins.push(
  new Visualizer(),
  new BundleAnalyzerPlugin(
    {
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8889,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info',
    }
  )
);
module.exports = () => webpackConfig;
