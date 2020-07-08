import { cutStr } from './components/common/utils';

// 初始化数据默认 mock 一份，或根据结构随机生成一份
export const NEW_CHART_VIEW_MAP = {
  'chart:line': {
    chartType: 'chart:line',
    title: 'line chart',
    description: '',
    hideHeader: true,
    hideReload: true,
    config: {
      option: {
        grid: { left: '5%' },
        // tooltip: {
        //   trigger: 'axis',
        //   transitionDuration: 0,
        //   confine: true,
        //   axisPointer: {
        //     type: 'none',
        //   },
        // },
        // legend: {
        //   bottom: 0,
        //   padding: [15, 5, 0, 5],
        //   orient: 'horizontal',
        //   align: 'left',
        //   type: 'scroll',
        //   tooltip: {
        //     show: true,
        //     formatter: (t: any) => cutStr(t.name, 100),
        //   },
        // },
        // textStyle: {
        //   fontFamily: 'arial',
        // },
        // yAxis: [
        //   {
        //     type: 'value',
        //     name: 'Y-Axis: Left',
        //     min: 0,
        //     max: 1,
        //     interval: 0.1,
        //     axisLabel: {
        //       formatter: '{value} unit',
        //     },
        //   },
        // ],
      },
    },
    dataSourceType: 'api',
    api: {},
  },
  'chart:area': {
    chartType: 'chart:area',
    title: 'area chart',
    description: '',
    hideHeader: true,
    hideReload: true,
    config: {
      option: {
        grid: { left: '5%' },
        // tooltip: {
        //   trigger: 'axis',
        //   transitionDuration: 0,
        //   confine: true,
        //   axisPointer: {
        //     type: 'none',
        //   },
        // },
        // legend: {
        //   bottom: 0,
        //   padding: [15, 5, 0, 5],
        //   orient: 'horizontal',
        //   align: 'left',
        //   type: 'scroll',
        //   tooltip: {
        //     show: true,
        //     formatter: (t: any) => cutStr(t.name, 100),
        //   },
        // },
        // textStyle: {
        //   fontFamily: 'arial',
        // },
        // yAxis: [
        //   {
        //     type: 'value',
        //     name: 'Y-Axis: Left',
        //     min: 0,
        //     max: 1,
        //     interval: 0.1,
        //     axisLabel: {
        //       formatter: '{value} unit',
        //     },
        //   },
        // ],
      },
    },
    dataSourceType: 'api',
    api: {},
  },
  'chart:bar': {
    chartType: 'chart:bar',
    title: 'bar chart',
    description: '',
    hideHeader: true,
    hideReload: true,
    config: {
      option: {
        grid: { left: '5%' },
        // tooltip: {
        //   trigger: 'axis',
        //   transitionDuration: 0,
        //   confine: true,
        //   axisPointer: {
        //     type: 'none',
        //   },
        // },
        // legend: {
        //   bottom: 0,
        //   padding: [15, 5, 0, 5],
        //   orient: 'horizontal',
        //   align: 'left',
        //   type: 'scroll',
        //   tooltip: {
        //     show: true,
        //     formatter: (t: any) => cutStr(t.name, 100),
        //   },
        // },
        // textStyle: {
        //   fontFamily: 'arial',
        // },
        // yAxis: [
        //   {
        //     type: 'value',
        //     name: 'Y-Axis: Left',
        //     min: 0,
        //     max: 1,
        //     interval: 0.1,
        //     axisLabel: {
        //       formatter: '{value} unit',
        //     },
        //   },
        // ],
      },
    },
    dataSourceType: 'api',
    api: {},
  },
  'chart:pie': {
    chartType: 'chart:pie',
    title: 'pie chart',
    description: '',
    hideHeader: true,
    hideReload: true,
    dataSourceType: 'api',
    api: {},
    config: {
      series: {
        radius: ['30%', '50%'],
      },
    },
  },
  table: {
    chartType: 'table',
    title: 'table chart',
    description: '',
    dataSourceType: 'api',
    api: {},
    config: {
      optionProps: {
        isMoreThanOneDay: true,
        moreThanOneDayFormat: 'M/D',
      },
    },
  },
  card: {
    title: 'card chart',
    description: '',
    chartType: 'card',
    dataSourceType: 'api',
    config: {},
    api: {},
  },
};

export const TEXT_ZH_MAP = {
  add: '新增',
  save: '保存',
  cancel: '取消',
  edit: '编辑',
  delete: '删除',
  ok: '确认',
  move: '移动',
  'exit fullscreen': '退出全屏',
  fullscreen: '全屏',
  'export picture': '导出图片',
  'confirm to delete': '确认删除',
  'parameter configuration': '参数配置',
  'datasource configuration': '数据源配置',
  'confirm to drop data': '确认丢弃数据',
  title: '标题',
  description: '描述',
  'select chart type': '选择图表类型',
  line: '线形图',
  area: '面积图',
  bar: '柱状图',
  pie: '饼图',
  table: '表格',
  metric: '指标',
  'failed to get data': '数据获取失败',
  loading: '加载中',
  'show mock data': '模拟数据展示',
  'no chart data': '页面为空,没有图表数据',
  'exporting picture': '正在导出图片...',
};

export const TEXT_EN_MAP = {
  add: 'add',
  save: 'save',
  cancel: 'cancel',
  edit: 'edit',
  delete: 'delete',
  ok: 'ok',
  move: 'move',
  'exit fullscreen': 'exit fullscreen',
  fullscreen: 'fullscreen',
  'export picture': 'export picture',
  'confirm to delete': 'confirm to delete',
  'parameter configuration': 'parameter configuration',
  'datasource configuration': 'datasource configuration',
  'confirm to drop data': 'confirm to drop data',
  title: 'title',
  description: 'description',
  'select chart type': 'select chart type',
  line: 'line',
  area: 'area',
  bar: 'bar',
  pie: 'pie',
  table: 'table',
  metric: 'metric',
  'failed to get data': 'failed to get data',
  loading: 'loading',
  'show mock data': 'show mock data',
  'no chart data': 'no chart data',
  'exporting picture': 'exporting picture...',
};
