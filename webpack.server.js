const path = require('path');
const swaggerParserMock = require('swagger-parser-mock');
const pathToRegexp = require('path-to-regexp');
const Mock = require('mockjs');
const webpackConfig = require('./webpack.config');
const { existsSync } = require('fs');

let urlOption = {};
if (existsSync('./dev-server.ignore.js')) {
  urlOption = require('./dev-server.ignore');
} else {
  throw new Error('请创建 dev-server.ignore.js文件');
}

const { backendUrl, frontUrl, port } = urlOption;

let mockpath = [];
if (existsSync('./swagger.json')) swaggerParserMock({ spec: require('./swagger.json') }).then((docs) => { mockpath = docs.paths; });

const devServer = {
  port: port || 8080,
  host: frontUrl,
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
  proxy: [
    {
      context: ['/api/ws'],
      target: backendUrl,
      secure: true,
      changeOrigin: true,
      ignorePath: false,
      ws: true,
      // logLevel: 'debug',
    },
    {
      context: ['/api'],
      target: backendUrl,
      secure: true,
      changeOrigin: true,
      ignorePath: false,
      onProxyRes(proxyRes, req, res) {
        if (proxyRes.statusCode === 404 || proxyRes.statusCode === 503) {
          Object.keys(mockpath).forEach((mockurl) => {
            mockpath[mockurl].mockUrl = mockurl.replace(/{/g, ':').replace(/}/g, '');
            if (pathToRegexp(mockpath[mockurl].mockUrl).exec(req.path)) {
              const responses = mockpath[mockurl][req.method.toLowerCase()].responses[200].example && JSON.parse(mockpath[mockurl][req.method.toLowerCase()].responses[200].example);
              res.json(Mock.mock(responses));
              console.log(`mockto: ${req.method} ${mockurl}`);
            }
          });
        }
      },
      // logLevel: 'debug',
    },
  ],
};

module.exports = {
  ...webpackConfig(),
  devServer,
};
