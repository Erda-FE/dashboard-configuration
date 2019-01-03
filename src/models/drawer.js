import { find, cloneDeep } from 'lodash';

const defaultState = {
  visible: false,
  editChartId: '',
  drawerInfoMap: {}, // 所有图表配置信息
};

export default {
  namespace: 'biDrawer',
  state: cloneDeep(defaultState),
  effects: {
    * submitDrawer(_, { put, select }) {
      const { biDrawer: { editChartId }, biDashBoard: { layout } } = yield select(state => state);
      const isExist = find(layout, ({ i }) => i === editChartId);
      if (!isExist) { // 添加
        yield put({ type: 'biDashBoard/generateChart', chartId: editChartId });
        return;
      }
      yield put({ type: 'closeDrawer' });
    },
    * editChart({ chartId }, { put, select }) {
      const { biDrawer: { editChartId } } = yield select(state => state);
      if (chartId === editChartId) return;
      yield put({ type: 'querySuccess', payload: { visible: true, editChartId: chartId } });
    },
    * onDrawerChange({ payload }, { select, put }) {
      const { editChartId, drawerInfoMap } = yield select(state => state.biDrawer);
      yield put({ type: 'querySuccess',
        payload: {
          drawerInfoMap: {
            ...drawerInfoMap,
            [editChartId]: { ...drawerInfoMap[editChartId], ...payload },
          },
        },
      });
    },
    * closeDrawer(_, { put, select }) {
      const { biDrawer: { editChartId }, biDashBoard: { layout } } = yield select(state => state);
      const isExist = find(layout, ({ i }) => i === editChartId);
      if (!isExist) { // 创建时取消就移除
        yield put({ type: 'biDashBoard/deleteChart', chartId: editChartId });
      }
      yield put({ type: 'querySuccess', payload: { visible: false, editChartId: '' } });
    },
    * deleteDrawer(_, { put, select }) { // 编辑时移除
      const { editChartId } = yield select(state => state.biDrawer);
      yield put({ type: 'biDashBoard/deleteChart', chartId: editChartId });
      yield put({ type: 'querySuccess', payload: { visible: false, editChartId: '' } });
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, ...payload };
    },
    init(state, { drawerInfoMap }) {
      return { ...state, drawerInfoMap };
    },
    openDrawerAdd(state) {
      const chartId = `chart-${generateUUID()}`;
      const { drawerInfoMap } = state;
      return { ...state, visible: true, editChartId: chartId, drawerInfoMap: { ...drawerInfoMap, [chartId]: {} } };
    },
    chooseChart(state, { chartType }) {
      const { drawerInfoMap, editChartId } = state;
      const drawerInfo = drawerInfoMap[editChartId];
      if (chartType === drawerInfo.chartType) return state;
      return { ...state, drawerInfoMap: { ...drawerInfoMap, [editChartId]: { ...drawerInfo, chartType } } };
    },
    chooseControl(state, { controlType }) {
      const { drawerInfoMap, editChartId } = state;
      const drawerInfo = drawerInfoMap[editChartId];
      if (controlType === drawerInfo.controlType) return state;
      return { ...state, drawerInfoMap: { ...drawerInfoMap, [editChartId]: { ...drawerInfo, controlType } } };
    },
    deleteDrawerInfo(state, { chartId }) {
      const { drawerInfoMap } = state;
      delete drawerInfoMap[chartId];
      return { ...state, drawerInfoMap: { ...drawerInfoMap } };
    },
    reset() {
      return { ...cloneDeep(defaultState) };
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
