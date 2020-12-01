# 图表配置器

>[Document](https://yuque.antfin-inc.com/terminus_paas_dev/front/zmcodh)

## 背景
前端在对接图表可视化需求时，对于差不多的数据结构，每次都需要搭建差别不大的页面，同时要花时间去调整一些图表展示的细节，为了解放前端的重复劳动，并赋能业务方或数据提供方快速产出图表，所以需要一套开箱即用的图表库，标准化、简化从图表数据获取处理到图表展示的全流程。

## 目标
基于 Echart 深度封装，可自由配置数据，定制个性化图表，打造面向后端等非前端开发人员开箱即用的图表配置器。

## 交互流程
1. 页面提供一块空白区域，初始化后提供进入编辑态的按钮
2. 进入编辑态后，空白区域网格化展示，点击添加新增一块默认大小的内容方块，内部填充默认图表和数据
3. 方块可以拖拽改变大小和位置
4. 点击方块内的操作，可以打开该方块内图表的配置器
5. 配置器中包含图表相关配置项（ECharts 配置的有限集）、数据源配置等
6. 配置完成后保存，可继续添加新的内容块或退出编辑态
7. 提供外部扩展能力，包括主题、交互控件、数据转换函数等，提前注册后可使用

## 如何使用
### 1. 调整 Webpack 配置
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
      w: 24, // 区块宽度，按容器等分 24 份，24 表示占满宽度
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