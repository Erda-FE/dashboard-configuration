const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const defaultConfig = require('./webpack.config');

const webpackConfig = { ...defaultConfig() };
webpackConfig.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8810,
    reportFilename: 'report.html',
    defaultSizes: 'parsed',
    openAnalyzer: true,
    generateStatsFile: false,
    statsFilename: 'stats.json',
    statsOptions: null,
    logLevel: 'info',
  }),
);
module.exports = () => webpackConfig;
