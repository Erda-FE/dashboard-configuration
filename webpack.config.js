const os = require('os');
const path = require('path');
const webpack = require('webpack');
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

// const smp = new SpeedMeasurePlugin();
const resolve = (pathname) => path.resolve(__dirname, pathname);

const gitRevisionPlugin = new GitRevisionPlugin();
const banner = `commit: ${gitRevisionPlugin.commithash().slice(0, 6)}
branch: ${gitRevisionPlugin.branch()}
buildTime: ${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}`;

module.exports = () => {
  const isProd = process.env.NODE_ENV === 'production';

  /** @type { import('webpack').Configuration } */
  const config = {
    devtool: !isProd && 'eval-cheap-module-source-map',
    mode: isProd ? 'production' : 'development',
    entry: {
      index: isProd ? './src/index.ts' : './example/index.js',
    },
    externals: isProd
      ? {
          lodash: 'lodash',
          echarts: 'echarts',
          react: 'react',
          'react-dom': 'react-dom',
          moment: 'moment',
          antd: 'antd',
          'react-dnd': 'react-dnd',
        }
      : undefined,
    output: {
      filename: '[name].js',
      path: resolve('dist'),
      publicPath: '/',
      library: 'DiceCharts',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.scss$/i,
          include: [resolve('example'), resolve('src')],
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  resolve('./src/styles/_variable.scss'),
                  resolve('./src/styles/_mixin.scss'),
                  resolve('./src/styles/_editor-utils.scss'),
                  resolve('./src/styles/_dashboard-util.scss'),
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
        },
        {
          test: /\.(j|t)sx?$/,
          include: [resolve('example'), resolve('src')],
          use: [
            'thread-loader',
            {
              loader: 'babel-loader',
              options: {
                plugins: ['jsx-control-statements', '@babel/plugin-transform-runtime'],
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.tsx', '.ts', '.d.ts'],
      modules: [resolve('example'), resolve('src'), 'node_modules'],
      alias: {
        src: resolve('src'),
        common: resolve('src/common'),
      },
    },
    cache: {
      type: 'filesystem',
    },
    performance: {
      hints: isProd ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    optimization: {
      minimize: isProd,
      moduleIds: 'named',
      chunkIds: 'named',
      // splitChunks: {
      //   chunks: 'all',
      //   minSize: 30000,
      //   minChunks: 1,
      //   maxAsyncRequests: 5,
      //   maxInitialRequests: 5,
      //   cacheGroups: {
      //     vendors: {
      //       test: /[\\/]node_modules[\\/]/,
      //       reuseExistingChunk: true,
      //       priority: -10,
      //     },
      //   },
      // },
      minimizer: isProd
        ? [
            new webpack.BannerPlugin(banner),
            new TerserPlugin({
              parallel: os.cpus().length,
            }),
            new CssMinimizerPlugin({
              minimizerOptions: {
                preset: [
                  'default',
                  {
                    discardComments: { removeAll: true },
                  },
                ],
              },
            }),
          ]
        : [new webpack.HotModuleReplacementPlugin()],
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /(zh-cn)|es/),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV), // because webpack just do a string replace, so a pair of quotes is needed
        },
      }),
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              // Options similar to the same options in webpackOptions.output
              // both options are optional
              filename: '[name].css',
              // chunkFilename: '[id].css',
            }),
            new CopyWebpackPlugin({
              patterns: [
                {
                  from: './src/**/*.d.ts',
                  to: ({ context, absoluteFilename }) => {
                    let paths = absoluteFilename.replace(`${context}/src`, `./types`);
                    if (absoluteFilename.indexOf(`${context}/src/types`) > -1) {
                      paths = absoluteFilename.replace(`${context}/src/types`, `./`);
                    }
                    return paths;
                  },
                },
              ],
            }),
          ]
        : [
            new webpack.DllReferencePlugin({
              context: __dirname,
              manifest: require('./manifest.json'),
            }),
            new HtmlWebpackPlugin({
              template: './example/views/index.ejs',
              hash: false,
              minify: false,
            }),
          ]),
    ],
  };

  // return smp.wrap(config);
  return config;
};
