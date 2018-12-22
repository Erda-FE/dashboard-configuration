import { get } from 'lodash';

export default {
  namespace: 'biDrawer',
  state: {
    visible: true,
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
      yield put({ type: 'biDrawer/chooseChart', chartType: get(chartDatasMap, [chartId, 'chartType']) });
    },
  },
  reducers: {
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
