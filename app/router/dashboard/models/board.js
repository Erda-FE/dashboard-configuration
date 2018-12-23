import { maxBy, remove, get } from 'lodash';
import agent from 'agent';
import { message } from 'antd';

export function getChartData(url) {
  return agent.get(url)
    .then(response => response.body);
}

export default {
  namespace: 'biDashBoard',
  state: {
    isEdit: false,
    layout: [],
    chartDatasMap: {}, // 图表基本数据信息
    dashboardType: '',
    drawerInfoMap: {}, // 所有图表配置信息
  },
  effects: {
    * generateChart(_, { call, select, put }) {
      const { biDashBoard: { chartDatasMap, layout }, biDrawer: { drawerInfo } } = yield select(state => state);
      const url = get(drawerInfo, ['panneldata#url']);
      const chartId = `chart-${generateUUID()}`;
      yield put({ type: 'biDrawer/beginEditChart', chartId });
      let chartData = { isMock: true };
      try {
        if (url) chartData = { ...chartData, ...(yield call(url)), isMock: false };
      } catch (error) {
        message.error('该图表接口获取数据失败,将使用mock数据显示', 3);
      }
      chartDatasMap[chartId] = chartData;
      layout.push({ i: chartId, x: 0, y: getNewChartYPostion(layout), w: 3, h: 6 });
      yield put({ type: 'querySuccess', payload: { chartDatasMap: { ...chartDatasMap }, layout } });
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, ...payload };
    },
    deleteChart(state, { chartId }) {
      const { chartDatasMap, layout, drawerInfoMap } = state;
      remove(layout, ({ i }) => chartId === i);
      delete chartDatasMap[chartId];
      delete drawerInfoMap[chartId];
      return { ...state, chartDatasMap: { ...chartDatasMap }, layout };
    },
    onLayoutChange(state, { layout }) {
      return { ...state, layout };
    },
    initDashboardType(state, { dashboardType }) {
      return { ...state, dashboardType };
    },
    openEdit(state) {
      return { ...state, isEdit: true };
    },
    saveEdit(state) {
      return { ...state, isEdit: false };
    },
  },
};

const getNewChartYPostion = (layout) => {
  const { y: maxY, h: maxH } = maxBy(layout, ({ y, h }) => y + h) || { y: 0, h: 0 };
  return maxY + maxH;
};

export const generateUUID = () => {
  let d = new Date().getTime();
  // 只用8位够了
  const uuid = 'xxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line
    const r = (d + (Math.random() * 16)) % 16 | 0;
    d = Math.floor(d / 16);
    // eslint-disable-next-line
    return (c === 'x' ? r : ((r & 0x7) | 0x8)).toString(16);
  });
  return uuid;
};
