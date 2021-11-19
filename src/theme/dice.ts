export const theme = 'dice';

const darkPurple = 'rgb(78, 96, 151)';
const darkGreen = 'rgb(73, 142, 158)';
const pink = 'rgb(222, 111, 87)';
const red = 'rgb(222, 87, 87)';
const yellow = 'rgb(247, 195, 107)';
const orange = 'rgb(247, 167, 107)';
const appleGreen = 'rgb(141, 179, 108)';
const green = 'rgb(108, 179, 139)';
const brown = 'rgb(169, 140, 114)';
const purple = 'rgb(151, 95, 160)';
const gray = 'rgb(205, 206, 209)';

export const colorMap = {
  darkPurple,
  darkGreen,
  pink,
  red,
  yellow,
  orange,
  appleGreen,
  green,
  brown,
  purple,
  gray,
};

const colorList = [darkPurple, pink, yellow, appleGreen, darkGreen, red, orange, green, brown, purple, gray];

export const areaColors = colorList.map((c) => `${c.slice(0, -1)}, 0.2)`);

export const themeObj = {
  color: colorList,
  backgroundColor: '#ffffff',
  textStyle: {},
  title: {
    textStyle: {
      color: '#7c7c9e',
    },
    subtextStyle: {
      color: '#7c7c9e',
    },
  },
  line: {
    itemStyle: {
      normal: {
        borderWidth: '2',
      },
    },
    lineStyle: {
      normal: {
        width: '2',
      },
    },
    symbolSize: '1',
    symbol: 'emptyCircle',
    smooth: true,
    smoothMonotone: 'x',
  },
  radar: {
    itemStyle: {
      normal: {
        borderWidth: '2',
      },
    },
    lineStyle: {
      normal: {
        width: '2',
      },
    },
    symbolSize: '1',
    symbol: 'emptyCircle',
    smooth: true,
  },
  bar: {
    itemStyle: {
      normal: {
        barBorderWidth: '0',
        barBorderColor: '#cccccc',
      },
      emphasis: {
        barBorderWidth: '0',
        barBorderColor: '#cccccc',
      },
    },
  },
  pie: {
    itemStyle: {
      normal: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
      emphasis: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
    },
  },
  scatter: {
    itemStyle: {
      normal: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
      emphasis: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
    },
  },
  boxplot: {
    itemStyle: {
      normal: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
      emphasis: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
    },
  },
  parallel: {
    itemStyle: {
      normal: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
      emphasis: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
    },
  },
  sankey: {
    itemStyle: {
      normal: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
      emphasis: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
    },
  },
  funnel: {
    itemStyle: {
      normal: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
      emphasis: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
    },
  },
  gauge: {
    itemStyle: {
      normal: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
      emphasis: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
    },
  },
  candlestick: {
    itemStyle: {
      normal: {
        color: '#eb8146',
        color0: 'transparent',
        borderColor: '#d95850',
        borderColor0: '#58c470',
        borderWidth: '2',
      },
    },
  },
  graph: {
    itemStyle: {
      normal: {
        borderWidth: '0',
        borderColor: '#cccccc',
      },
    },
    lineStyle: {
      normal: {
        width: 1,
        color: '#aaa',
      },
    },
    symbolSize: '1',
    symbol: 'emptyCircle',
    smooth: true,
    color: [
      '#035BE3',
      '#2DC083',
      '#5B45C2',
      '#FEAB00',
      '#D842DA',
      '#50A3E3',
      '#DF3409',
      '#F6D51A',
      '#102997',
      '#2E8B36',
      '#A238B7',
      '#9CC3FF',
    ],
    label: {
      normal: {
        textStyle: {
          color: '#ffffff',
        },
      },
    },
  },
  map: {
    itemStyle: {
      normal: {
        areaColor: '#f3f3f3',
        borderColor: '#999999',
        borderWidth: 0.5,
      },
      emphasis: {
        areaColor: 'rgba(255,178,72,1)',
        borderColor: '#eb8146',
        borderWidth: 1,
      },
    },
    label: {
      normal: {
        textStyle: {
          color: '#893448',
        },
      },
      emphasis: {
        textStyle: {
          color: 'rgb(137,52,72)',
        },
      },
    },
  },
  geo: {
    itemStyle: {
      normal: {
        areaColor: '#f3f3f3',
        borderColor: '#999999',
        borderWidth: 0.5,
      },
      emphasis: {
        areaColor: 'rgba(255,178,72,1)',
        borderColor: '#eb8146',
        borderWidth: 1,
      },
    },
    label: {
      normal: {
        textStyle: {
          color: '#893448',
        },
      },
      emphasis: {
        textStyle: {
          color: 'rgb(137,52,72)',
        },
      },
    },
  },
  categoryAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#aaaaaa',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333',
      },
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#343659',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#f1f1f1'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  valueAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#aaaaaa',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333',
      },
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#343659',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#f1f1f1'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  logAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#aaaaaa',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333',
      },
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#343659',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#f1f1f1'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  timeAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#aaaaaa',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333',
      },
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#343659',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#f1f1f1'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  toolbox: {
    iconStyle: {
      normal: {
        borderColor: '#999999',
      },
      emphasis: {
        borderColor: '#666666',
      },
    },
  },
  legend: {
    textStyle: {
      color: '#343659',
    },
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0, 0, 0, .1)',
    borderWidth: 1,
    textStyle: {
      color: 'rgba(0, 0, 0, .6)',
    },
    axisPointer: {
      lineStyle: {
        color: '#cccccc',
        width: 1,
      },
      crossStyle: {
        color: '#cccccc',
        width: 1,
      },
    },
  },
  timeline: {
    lineStyle: {
      color: '#893448',
      width: 1,
    },
    itemStyle: {
      normal: {
        color: '#893448',
        borderWidth: 1,
      },
      emphasis: {
        color: '#ffb248',
      },
    },
    controlStyle: {
      normal: {
        color: '#893448',
        borderColor: '#893448',
        borderWidth: 0.5,
      },
      emphasis: {
        color: '#893448',
        borderColor: '#893448',
        borderWidth: 0.5,
      },
    },
    checkpointStyle: {
      color: '#eb8146',
      borderColor: 'rgba(255,178,72,0.41)',
    },
    label: {
      normal: {
        textStyle: {
          color: '#893448',
        },
      },
      emphasis: {
        textStyle: {
          color: '#893448',
        },
      },
    },
  },
  visualMap: {
    color: ['#893448', '#d95850', '#eb8146', '#ffb248', '#f2d643', 'rgb(247,238,173)'],
  },
  dataZoom: {
    backgroundColor: 'rgba(255,255,255,0)',
    dataBackgroundColor: 'rgba(255,178,72,0.5)',
    fillerColor: 'rgba(255,178,72,0.15)',
    handleColor: '#ffb248',
    handleSize: '100%',
    textStyle: {
      color: '#333333',
    },
  },
  markPoint: {
    label: {
      normal: {
        textStyle: {
          color: '#ffffff',
        },
      },
      emphasis: {
        textStyle: {
          color: '#ffffff',
        },
      },
    },
  },
};
