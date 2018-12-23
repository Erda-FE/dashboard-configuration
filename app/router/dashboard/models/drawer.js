import { get } from 'lodash';

export default {
  namespace: 'biDrawer',
  state: {
    visible: false,
    chartType: '',
    editChartId: '',
    drawerInfo: {}, // 当前编辑的图表配置信息
    drawerInfoMap: {}, // 所有图表配置信息
  },
  effects: {
    * submitDrawer(_, { put, select }) {
      const { chartType, editChartId } = yield select(state => state.biDrawer);
      if (!editChartId) {
        yield put({ type: 'biDashBoard/generateChart', chartType });
        return;
      }
      yield put({ type: 'closeDrawer' });
    },
    * editChart({ chartId }, { put, select }) {
      const { biDrawer: { editChartId, drawerInfoMap }, biDashBoard: { chartDatasMap } } = yield select(state => state);
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
    beginEditChart(state, { chartId }) {
      return { ...state, editChartId: chartId };
    },
    onDrawerChange(state, { payload }) {
      return { ...state, drawerInfo: payload };
    },
    openDrawerAdd(state) {
      return { ...state, visible: true, chartType: '', editChartId: '' };
    },
    closeDrawer(state) {
      const { drawerInfoMap, drawerInfo, editChartId } = state;
      return { ...state, drawerInfoMap: { ...drawerInfoMap, [editChartId]: drawerInfo }, visible: false, chartType: '', editChartId: '' };
    },
    chooseChart(state, { chartType }) {
      if (chartType === state.chartType) return state;
      return { ...state, chartType };
    },
  },
};
