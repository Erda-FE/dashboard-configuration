const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os');

// const smp = new SpeedMeasurePlugin();

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const createHappyPackPlugin = (id, loaders) => new HappyPack({
  id,
  loaders,
  threadPool: happyThreadPool,
});
const resolve = pathname => path.resolve(__dirname, pathname);

module.exports = () => {
  const isProd = process.env.NODE_ENV === 'production';

  /** @type { import('webpack').Configuration } */
  const config = {
    devtool: 'cheap-module-eval-source-map',
    node: {
      net: 'empty',
    },
    mode: isProd ? 'production' : 'development',
    entry: {
      index: isProd ? './src/index.ts' : './example/index.js',
    },
    externals: isProd ? {
      lodash: 'lodash',
      echarts: 'echarts',
      react: 'react',
      'react-dom': 'react-dom',
      moment: 'moment',
    } : undefined,
    stats: {
      assets: false,
      children: false,
    },
    output: {
      path: path.join(__dirname, '/dist'),
      filename: '[name].js',
      // chunkFilename: '[chunkhash].chunk.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          include: [
            resolve('example'),
            resolve('src'),
          ],
          exclude: /node_modules/,
          loaders: [
            MiniCssExtractPlugin.loader, // use MiniCssExtractPlugin+happypack https://github.com/amireh/happypack/issues/223
            'happypack/loader?id=scss',
          ],
        },
        {
          test: /\.(css)$/,
          loaders: [
            MiniCssExtractPlugin.loader,
            'happypack/loader?id=css',
          ],
        },
        {
          test: /\.(tsx?|jsx?)$/,
          loader: 'happypack/loader?id=ts',
          include: [
            resolve('example'),
            resolve('src'),
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.tsx', '.ts', '.d.ts'],
      modules: [resolve('example'), resolve('src'), 'node_modules'],
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    optimization: {
      minimize: false,
      namedChunks: true,
      moduleIds: 'named',
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 5,
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            reuseExistingChunk: true,
            priority: -10,
          },
        },
      },
      minimizer: isProd
        ? [
          new UglifyJsPlugin({
            sourceMap: false,
            cache: path.join(__dirname, '/.cache'),
            parallel: true,
            uglifyOptions: {
              output: {
                comments: false,
                beautify: false,
              },
            },
          }),
          new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessorOptions: {
              safe: true,
              discardComments: { removeAll: true },
              autoprefixer: {
                remove: false,
              },
            },
          }),
        ]
        : [
          new webpack.HotModuleReplacementPlugin(),
        ],
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV), // because webpack just do a string replace, so a pair of quotes is needed
        },
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      createHappyPackPlugin('ts', [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            happyPackMode: true,
            getCustomTransformers: path.join(__dirname, 'webpack_ts.loader.js'),
          },
        },
      ]),
      createHappyPackPlugin('css', [
        'css-loader',
      ]),
      createHappyPackPlugin('less', [
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            sourceMap: false,
            javascriptEnabled: true,
          },
        },
      ]),
      createHappyPackPlugin('scss', [
        {
          loader: 'css-loader',
          options: {
            sourceMap: false,
            localIdentName: '[name]_[local]-[hash:base64:7]',
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: false,
          },
        },
        {
          loader: 'sass-resources-loader',
          options: {
            sourceMap: false,
            resources: [
              resolve('./src/styles/_variable.scss'),
            ],
          },
        },
      ]),
      new HardSourceWebpackPlugin({
        cachePrune: {
          // Caches younger than `maxAge` are not considered for deletion. They must
          // be at least this (default: 2 days) old in milliseconds.
          maxAge: 2 * 24 * 60 * 60 * 1000,
          // All caches together must be larger than `sizeThreshold` before any
          // caches will be deleted. Together they must be at least this
          // (default: 50 MB) big in bytes.
          sizeThreshold: 50 * 1024 * 1024,
          // How to launch the extra processes. Default:
        },
        fork: (fork, compiler, webpackBin) => fork(
          webpackBin(),
          ['--config', __filename], {
            silent: true,
          }
        ),
        // Number of workers to spawn. Default:
        numWorkers: () => os.cpus().length,
        // Number of modules built before launching parallel building. Default:
        minModules: 10,
      }),
      new HardSourceWebpackPlugin.ExcludeModulePlugin([
        {
          // HardSource works with mini-css-extract-plugin but due to how
          // mini-css emits assets, assets are not emitted on repeated builds with
          // mini-css and hard-source together. Ignoring the mini-css loader
          // modules, but not the other css loader modules, excludes the modules
          // that mini-css needs rebuilt to output assets every time.
          test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
        },
      ]),
      ...(
        isProd
          ? []
          : [
            new webpack.DllReferencePlugin({
              context: __dirname,
              manifest: require('./manifest.json'),
            }),
            new CopyWebpackPlugin([
              { from: './src/static', to: 'static' },
            ]),
            new HtmlWebpackPlugin({
              filename: 'index.html',
              template: './example/views/index.ejs',
              hash: false,
              minify: false,
            }),
          ]
      ),
    ],
  };

  // return smp.wrap(config);
  return config;
};
