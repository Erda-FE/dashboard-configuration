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
