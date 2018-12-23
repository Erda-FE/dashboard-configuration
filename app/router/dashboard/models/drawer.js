import { get } from 'lodash';

export default {
  namespace: 'biDrawer',
  state: {
    visible: false,
    chartType: '',
    editChartId: '',
    drawerInfo: {}, // 当前编辑的图表配置信息
  },
  effects: {
    * submitDrawer(_, { put, select }) {
      const { editChartId, drawerInfo } = yield select(state => state.biDrawer);
      if (!editChartId) {
        const chartId = `chart-${generateUUID()}`;
        yield put({ type: 'biDashBoard/generateChart', chartId });
        yield put({ type: 'querySuccess', payload: { editChartId: chartId } });
        return;
      }
      yield put({ type: 'biDashBoard/updateDrawerInfoMap', drawerInfo, editChartId });
      yield put({ type: 'closeDrawer' });
    },
    * editChart({ chartId }, { put, select }) {
      const { biDrawer: { editChartId }, biDashBoard: { chartDatasMap, drawerInfoMap } } = yield select(state => state);
      if (chartId === editChartId) return;
      yield put({ type: 'querySuccess',
        payload: {
          visible: true,
          chartType: get(chartDatasMap, [chartId, 'chartType']),
          editChartId: chartId,
          drawerInfo: drawerInfoMap[chartId],
        },
      });
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, ...payload };
    },
    onDrawerChange(state, { payload }) {
      return { ...state, drawerInfo: payload };
    },
    openDrawerAdd(state) {
      return { ...state, visible: true, chartType: '', editChartId: '' };
    },
    closeDrawer(state) {
      return { ...state, visible: false, chartType: '', editChartId: '' };
    },
    chooseChart(state, { chartType }) {
      if (chartType === state.chartType) return state;
      return { ...state, chartType };
    },
  },
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
