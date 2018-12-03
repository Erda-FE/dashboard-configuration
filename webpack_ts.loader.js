// 进程间是不能拷贝 方法的, 导致了 getCustomTransformers的在happypack中不能被执行
// https://github.com/Igorbek/typescript-plugin-styled-components

const tsImportPluginFactory = require('ts-import-plugin');

const getCustomTransformers = () => ({
  before: [tsImportPluginFactory([
    {
      libraryName: 'antd',
      libraryDirectory: 'lib',
      style: true,
    },
    {
      style: false,
      libraryName: 'lodash',
      libraryDirectory: null,
      camel2DashComponentName: false,
    },
  ])],
});

module.exports = getCustomTransformers;
