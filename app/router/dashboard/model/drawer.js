export default {
  namespace: 'biDrawer',
  state: {
    visible: true,
    chartType: '',
  },
  effects: {
    * submitDrawer(_, { put, select }) {
      const { chartType } = yield select(state => state.biDrawer);
      yield put({ type: 'biDashBoard/generateChart', chartType });
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
