const theme = 'dice';

const themeObj = {
  color: [
    'rgb(70, 204, 147)',
    'rgb(244, 194, 84)',
    'rgb(80, 209, 218)',
    'rgb(245, 107, 107)',
    'rgb(45, 158, 241)',
    'rgb(141, 110, 241)',
    'rgb(208, 93, 220)',
    'rgb(120, 137, 245)',
    'rgb(151, 208, 107)',
    'rgb(231, 121, 95)',
    'rgb(93, 212, 147)',
    'rgb(76, 130, 219)',
  ],
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
    symbolSize: '6',
    symbol: 'emptyCircle',
    smooth: true,
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
    symbolSize: '6',
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
    symbolSize: '6',
    symbol: 'emptyCircle',
    smooth: true,
    color: [
      '#46cc93',
      '#50d1da',
      '#f4c254',
      '#f56b6b',
      '#2d9ef1',
      '#7e5dea',
      '#d05ddc',
      '#5265df',
      '#97d06b',
      '#e7795f',
      '#5dd493',
      '#4c82db',
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
        color: [
          '#f1f1f1',
        ],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: [
          'rgba(250,250,250,0.05)',
          'rgba(200,200,200,0.02)',
        ],
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
        color: [
          '#f1f1f1',
        ],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: [
          'rgba(250,250,250,0.05)',
          'rgba(200,200,200,0.02)',
        ],
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
        color: [
          '#f1f1f1',
        ],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: [
          'rgba(250,250,250,0.05)',
          'rgba(200,200,200,0.02)',
        ],
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
        color: [
          '#f1f1f1',
        ],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: [
          'rgba(250,250,250,0.05)',
          'rgba(200,200,200,0.02)',
        ],
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
    color: [
      '#893448',
      '#d95850',
      '#eb8146',
      '#ffb248',
      '#f2d643',
      'rgb(247,238,173)',
    ],
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

export default {
  theme,
  themeObj,
};
