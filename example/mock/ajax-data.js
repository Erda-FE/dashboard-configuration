const resp = { title: '性能区间', total: 0, interval: null, time: [1563068460000, 1563068520000, 1563068580000, 1563068640000, 1563068700000, 1563068760000, 1563068820000, 1563068880000, 1563068940000, 1563069000000, 1563069060000, 1563069120000, 1563069180000, 1563069240000, 1563069300000, 1563069360000, 1563069420000, 1563069480000, 1563069540000, 1563069600000, 1563069660000, 1563069720000, 1563069780000, 1563069840000, 1563069900000, 1563069960000, 1563070020000, 1563070080000, 1563070140000, 1563070200000, 1563070260000, 1563070320000, 1563070380000, 1563070440000, 1563070500000, 1563070560000, 1563070620000, 1563070680000, 1563070740000, 1563070800000, 1563070860000, 1563070920000, 1563070980000, 1563071040000, 1563071100000, 1563071160000, 1563071220000, 1563071280000, 1563071340000, 1563071400000, 1563071460000, 1563071520000, 1563071580000, 1563071640000, 1563071700000, 1563071760000, 1563071820000, 1563071880000, 1563071940000, 1563072000000], results: [{ name: 'ta_timing', data: [{ 'avg.srt': { name: '服务器响应', tag: null, data: [19, 5, 29, 27, 10, 16, 30, 46, 49, 15, 0, 40, 43, 41, 6, 31, 9, 43, 31, 7, 33, 1, 1, 31, 45, 15, 28, 21, 22, 6, 36, 41, 31, 22, 1, 16, 44, 10, 39, 46, 20, 43, 14, 43, 15, 15, 16, 44, 26, 12, 16, 27, 38, 6, 27, 10, 33, 37, 11, 21], unit: 'ms', unitType: 'time', chartType: 'line', axisIndex: 0 }, 'avg.rlt': { name: '资源加载', tag: null, data: [21, 15, 0, 25, 6, 11, 9, 17, 27, 26, 22, 24, 12, 11, 21, 27, 23, 18, 2, 22, 6, 8, 12, 2, 10, 5, 5, 26, 4, 8, 2, 18, 17, 2, 27, 11, 15, 20, 10, 7, 27, 12, 27, 15, 29, 13, 4, 21, 21, 3, 24, 24, 28, 16, 26, 20, 17, 4, 11, 16], unit: 'ms', unitType: 'time', chartType: 'line', axisIndex: 0 }, 'avg.plt': { name: '整页加载', tag: null, data: [29, 0, 17, 5, 3, 3, 7, 5, 1, 3, 12, 11, 26, 5, 11, 15, 5, 24, 29, 12, 11, 24, 10, 29, 24, 9, 28, 1, 19, 29, 26, 9, 16, 25, 29, 5, 29, 27, 22, 0, 21, 21, 14, 8, 5, 8, 23, 1, 9, 29, 3, 9, 28, 20, 2, 19, 19, 13, 10, 23], unit: 'ms', unitType: 'time', chartType: 'bar', axisIndex: 0 }, 'avg.tcp': { name: '请求排队', tag: null, data: [9, 6, 3, 4, 8, 8, 0, 5, 5, 5, 7, 1, 5, 3, 6, 9, 6, 2, 4, 0, 4, 7, 3, 6, 9, 6, 0, 5, 9, 4, 6, 1, 6, 2, 2, 5, 0, 3, 9, 7, 3, 1, 3, 4, 1, 0, 3, 9, 2, 3, 1, 7, 6, 1, 3, 3, 3, 9, 0, 8], unit: 'ms', unitType: 'time', chartType: 'line', axisIndex: 0 } }] }] };

const transToDate = (stamp) => {
  const a = new Date(stamp);
  return `${a.getHours()}:${a.getMinutes()}`;
};
export const ajaxConvertor = (body) => {
  const { time, results } = body;
  const xData = time.map(stamp => transToDate(stamp));
  const metricData = [];
  const legendData = [];
  const seriesObj = results[0].data[0];
  // eslint-disable-next-line array-callback-return
  Object.keys(seriesObj).map((k) => {
    const item = seriesObj[k];
    metricData.push({
      name: item.name,
      type: item.chartType,
      data: item.data,
    });
    legendData.push(item.name);
  });
  return {
    xData, metricData, legendData,
  };
};

export default [
  {
    w: 12,
    h: 9,
    x: 0,
    y: 0,
    i: 'view-2',
    moved: false,
    static: false,
    view: {
      name: '性能区间',
      chartType: 'chart:mix',
      // staticData,
      loadData() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(resp);
          }, 1000);
        });
      },
      dataConvertor: 'ajax',
      // dataConvertor(data) {
      //   console.log('convert:', data);
      //   return data;
      // },
      controls: ['input'],
      config: {
        option: {
          // title: {
          //   show: true,
          //   text: '性能区间',
          // },
          // legend: {
          //   show: true,
          //   bottom: '0',
          //   data: '',
          // },
        },
      },
    },
  },
];
