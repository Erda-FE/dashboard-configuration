export default {
  namespace: 'biDrawer',
  state: {
    visible: true,
    chartType: '',
  },
  effects: {
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
