## 如何使用
```js
  // 1、将model加入项目的model中
  // 引入
  import { biModels } from '@terminus/bi-ui-package'

  // 加入，各项目不同，model引入的方式可能不同
  model = [
    ...biModels
  ]
  ...

  // 2、引入组件，栅格布局
  import { BoardGrid } from '@terminus/bi-ui-package'
  
  <BoardGrid 
    readOnly={false}
    extra={extra} 
    onSave={this.onSave}
    theme={theme}
    themeObj={themeObj}
  />

  // 3、webpack相关配置变更，因为当前没有转为es5
  // 1) scss变更
  test: /\.scss$/,
  include: [
    path.resolve(__dirname, 'app'),
    path.resolve(__dirname, 'node_modules/@terminus/bi-ui-package'),
  ],
  exclude: /node_modules\/(?!@terminus\/).*/,

  // 2) ts变更
  test: /\.(tsx?|jsx?)$/,
  exclude: /node_modules\/(?!@terminus\/).*/,
    
  // 3）主题色
  // a.定义颜色值
  {
    loader: 'sass-resources-loader',
    options: {
      sourceMap: false,
      resources: [
        path.resolve(__dirname, './app/styles/_color.scss'),
      ],
    },
  },
  // b._color.scss中请务必定义$color-primary的颜色值
  $color-primary: #44c790; // 举例
```

## 属性Props说明
```js
  // 只读
  // 默认为false
  readOnly: false

  // 仪表盘的基本信息
  // 非必传, 默认如下
  extra: { 
    layout: [], 布局信息
    drawerInfoMap: {}, // 所有图表配置信息
  }

  // 保存时的回调接口
  // 非必传
  onSave: (extra) => void,

  // echarts的主题
  // 非必传, 默认如下, 如果传入必须同时传入
  // 用户可以去http://www.echartsjs.com/download-theme.html 这里去下载或者定制自己的主题
  theme: 'dice'
  themeObj: dice的themeObj
```

## 其他文档
[如何调试](./Debug.md)

[功能规划](https://yuque.antfin-inc.com/docs/share/4d74d1c0-367f-4dd2-94ff-30eb3fcad10a)