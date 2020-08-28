const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const HappyPack = require('happypack');
const os = require('os');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const resolve = pathname => path.resolve(__dirname, pathname);

module.exports = () => {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    devtool: isProd ? '' : 'cheap-module-eval-source-map',
    node: {
      net: 'empty',
    },
    entry: {
      index: isProd ? './src/index.ts' : './example/index.js',
    },
    externals: isProd ? {
      lodash: 'lodash',
      echarts: 'echarts',
      antd: 'antd',
      react: 'react',
      'react-dom': 'react-dom',
      'moment': 'moment',
    } : undefined,
    stats: {
      assets: false,
      children: false,
    },
    output: {
      path: path.join(__dirname, '/public'),
      filename: '[name].js',
      chunkFilename: '[id].chunk.js',
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
        // {
        //   test: /\.(less)$/,
        //   loaders: [
        //     MiniCssExtractPlugin.loader,
        //     'happypack/loader?id=less',
        //   ],
        //   include: [
        //     resolve('src'),
        //     resolve('node_modules/antd'),
        //   ],
        // },
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
          exclude: /node_modules/,
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
        },
      ],
    },
    resolve: {
      alias: {
        // 其他
        agent: resolve('example/agent.js'),
        app: resolve('example'),
        ws: resolve('example/ws.js'),
        interface: resolve('interface'),
        common: resolve('./src/components/common'),
        theme: resolve('./src/theme/dice.ts'),
      },
      extensions: ['.js', '.jsx', '.tsx', '.ts', '.d.ts'],
      modules: [resolve('example'), resolve('src'), 'node_modules'],
    },
    optimization: {
      minimize: isProd,
      // runtimeChunk: true,
      namedChunks: true,
      // moduleIds: 'hashed',
      splitChunks: {
        chunks: 'all', // 必须三选一：'initial' | 'all' | 'async'
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 6,
        name: true,
        // cacheGroups: {
        //   styles: {
        //     name: 'styles',
        //     test: /\.s?css$/,
        //     chunks: 'all',
        //     enforce: true,
        //     priority: 1,
        //   },
        //   commons: {
        //     name: 'chunk-commons',
        //     test: resolve('example/common'),
        //     minChunks: 2, // 最小公用次数
        //     priority: 2,
        //     chunks: 'all',
        //     reuseExistingChunk: true, // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的
        //   },
        // },
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
            cssProcessor: cssnano,
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
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV), // because webpack just do a string replace, so a pair of quotes is needed
        },
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new HappyPack({
        id: 'ts',
        threadPool: happyThreadPool,
        loaders: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: true,
              getCustomTransformers: path.join(__dirname, 'webpack_ts.loader.js'),
            },
          },
        ],
      }),
      new HappyPack({
        id: 'css',
        threadPool: happyThreadPool,
        loaders: [
          'css-loader',
        ],
      }),
      new HappyPack({
        id: 'less',
        threadPool: happyThreadPool,
        loaders: [
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              sourceMap: false,
              javascriptEnabled: true,
            },
          },
        ],
      }),
      new HappyPack({
        id: 'scss',
        threadPool: happyThreadPool,
        loaders: [
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
        ],
      }),
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
            })
          ]
      )
    ],
  };
};

