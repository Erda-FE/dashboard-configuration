import { get } from 'lodash';

export default {
  namespace: 'biDrawer',
  state: {
    visible: false,
    chartType: '',
    editChartId: '',
    drawerInfo: {},
  },
  effects: {
    * submitDrawer(_, { put, select }) {
      const { chartType, editChartId } = yield select(state => state.biDrawer);
      if (!editChartId) {
        yield put({ type: 'biDashBoard/generateChart', chartType });
      }
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
    onDrawerInfoChange(state, { payload }) {
      return { ...state, drawerInfo: payload };
    },
    openDrawer(state) {
      return { ...state, visible: true, chartType: '', editChartId: '' };
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
