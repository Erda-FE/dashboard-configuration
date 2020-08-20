# 图表配置器

## 目标
现在前端对接图表时，相同的数据结构，总是要花不少时间去调整很多细节。需要一个封装好的库，对后端和用户赋能，通过自定义图表大盘的能力，解放前端的重复劳动。

## 整体架构
基于 cube-state 状态管理和 ECharts 图表库、antd 组件库

### 文件结构
grid：布局
config：所有配置相关，比如合并配置，不同类型图表配置等
components：所有组件，图表、表单项、控件等
theme：主题相关
utils：所有工具相关，比如校验等
models：所有状态数据

### 规划流程
1. 页面提供一块空白区域，初始化后提供进入编辑态的按钮
2. 进入编辑态后，空白区域网格化展示，点击添加新增一块默认大小的内容方块，内部填充默认图表和数据
3. 方块可以拖拽改变大小和位置
4. 点击方块内的操作，可以打开该方块内图表的配置器
5. 配置器中包含图表相关配置项（ECharts 配置的有限集）、数据源配置等
6. 配置完成后保存，可继续添加新的内容块或退出编辑态
7. 提供外部扩展能力，包括主题、交互控件、数据转换函数等，提前注册后可使用

## 如何使用
### 1. 调整webpack配置
webpack相关配置变更，因为当前没有转为es5，需要项目中转换
```js
  // 1) scss变更
  test: /\.scss$/,
  include: [
    path.resolve(__dirname, 'app'),
    path.resolve(__dirname, 'node_modules/@terminus/dashboard-configurator'),
  ],
  exclude: /node_modules\/(?!@terminus\/).*/,

  // 2) ts变更
  test: /\.(tsx?|jsx?)$/,
  exclude: /node_modules\/(?!@terminus\/).*/,

```

### 2. 注册扩展
在初始化时执行，这样才能在后续组件使用时生效。
```jsx
  import { registDataConvertor, registChartOptionFn, registControl } from '@terminus/dashboard-configurator';

  registDataConvertor('monitor', monitorDataConvertor);
  registChartOptionFn('monitorLine', getLineOption);

```

### 3. 组件中使用
引入组件，栅格布局
```jsx
  import { BoardGrid } from '@terminus/dashboard-configurator'

  const layout = [
    {
      w: 12, // 区块宽度，按容器等分12份，12表示占满宽度
      h: 9, // 区块高度，一般为9即可
      x: 0, // 区块左上角左偏移位置
      y: 0, // 区块左上角上偏移位置
      i: 'error-type', // 唯一id
      moved: false, // 是否可移动
      static: false, //
      view: { // 区块内容，不限于图表，可自定义注册组件
        title: '', // 区块标题
        description: '', // 区块描述
        chartType: 'chart:line | chart:bar | chart:pie | list | card', // 区块内容类型
        hideReload: true, // 隐藏刷新按钮
        hideHeader: true, // 隐藏header区块（包含control组件和刷新按钮等）
        dataSourceType: 'static | api',
        staticData: realTimeStaticData, // 使用的静态数据
        dataHandler: '', // 外部注册的数据处理方法名称
        maskMsg: '', // 不为空时显示mask并以其作为提示内容
        // controls: [], // 外部注册的组件名称列表
        api: {
          url: '',
          query: {},
          body: {},
          header: {},
        },  // 使用的 api
        config: {}, // 图表自定义配置
      },
    },
  ];

  return (
    <BoardGrid
      readOnly
      layout={layout}
    />
  )

```

## 其他文档
[如何开发](./Debug.md)

[功能规划](https://yuque.antfin-inc.com/terminus_paas_dev/front/rgziz6)
