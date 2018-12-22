import { get } from 'lodash';

export default {
  namespace: 'biDrawer',
  state: {
    visible: false,
    chartType: '',
    editChartId: '',
  },
  effects: {
    * submitDrawer(_, { put, select }) {
      const { chartType } = yield select(state => state.biDrawer);
      yield put({ type: 'biDashBoard/generateChart', chartType });
    },
    * editChart({ chartId }, { put, select }) {
      const { biDrawer: { editChartId }, biDashBoard: { chartDatasMap } } = yield select(state => state);
      if (chartId === editChartId) return;
      yield put({ type: 'querySuccess', payload: { visible: true, chartType: get(chartDatasMap, [chartId, 'chartType']), editChartId: chartId } });
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, ...payload };
    },
    openDrawer(state) {
      return { ...state, visible: true };
    },
    closeDrawer(state) {
      return { ...state, visible: false };
    },
    chooseChart(state, { chartType }) {
      if (chartType === state.chartType) return state;
      return { ...state, chartType };
    },
  },
};
