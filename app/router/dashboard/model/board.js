
const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const datas = [{
  data: [820, 932, 901, 934, 1290, 1330, 1320],
}];


export default {
  namespace: 'biDashBoard',
  state: {
    layout: [{ i: 'a', x: 0, y: 0, w: 3, h: 6 }],
    chartDatasMap: { a: {
      chartType: 'bar',
      names,
      datas: datas.map(single => ({ ...single, type: 'bar' })),
    } },
    dashboardType: '',
  },
  effects: {
  },
  reducers: {
    generateChart(state, { chartType }) {
      const { chartDatasMap, layout } = state;
      const key = `chart-${Date.parse(new Date())}`;
      chartDatasMap[key] = generateChartData(chartType);
      layout.push({ i: key, x: 3, y: 0, w: 3, h: 6 });
      return { ...state, chartDatasMap: { ...chartDatasMap }, layout };
    },
    onLayoutChange(state, { layout }) {
      return { ...state, layout };
    },
    initDashboardType(state, { dashboardType }) {
      return { ...state, dashboardType };
    },
  },
};

const generateChartData = (chartType) => {
  switch (chartType) {
    case 'line':
    case 'bar':
    case 'area':
      return {
        names,
        chartType,
        datas: datas.map(single => ({ ...single, type: chartType })),
      };
    default:
      return {};
  }
};
