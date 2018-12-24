export default {
  namespace: 'biDrawer',
  state: {
    visible: false,
    editChartId: '',
    drawerInfo: { // 当前编辑的图表配置信息
      chartType: '',
    },
  },
  effects: {
    * submitDrawer(_, { put, select }) {
      const { editChartId, drawerInfo } = yield select(state => state.biDrawer);
      if (!editChartId) { // 添加
        const chartId = `chart-${generateUUID()}`;
        yield put({ type: 'biDashBoard/generateChart', chartId });
        yield put({ type: 'querySuccess', payload: { editChartId: chartId } });
        return;
      }
      // 与board同步信息
      yield put({ type: 'biDashBoard/updateDrawerInfoMap', drawerInfo, editChartId });
    },
    * editChart({ chartId }, { put, select }) {
      const { biDrawer: { editChartId }, biDashBoard: { drawerInfoMap } } = yield select(state => state);
      if (chartId === editChartId) return;
      yield put({ type: 'querySuccess',
        payload: {
          visible: true,
          editChartId: chartId,
          drawerInfo: drawerInfoMap[chartId],
        },
      });
    },
    * onDrawerChange({ payload }, { select, put }) {
      const { editChartId, drawerInfo } = yield select(state => state.biDrawer);
      const newDrawerInfo = { ...drawerInfo, ...payload };
      if (editChartId) { // 与board同步信息
        yield put({ type: 'biDashBoard/updateDrawerInfoMap', drawerInfo: newDrawerInfo, editChartId });
      }
      yield put({ type: 'querySuccess', payload: { drawerInfo: newDrawerInfo } });
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, ...payload };
    },
    onDrawerChange(state, { payload }) {
      return { ...state, drawerInfo: { ...state.drawerInfo, ...payload } };
    },
    openDrawerAdd(state) {
      return { ...state, visible: true, editChartId: '', drawerInfo: {} };
    },
    closeDrawer(state) {
      return { ...state, visible: false, editChartId: '', drawerInfo: {} };
    },
    chooseChart(state, { chartType }) {
      const { drawerInfo } = state;
      if (chartType === drawerInfo.chartType) return state;
      return { ...state, drawerInfo: { ...drawerInfo, chartType } };
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
