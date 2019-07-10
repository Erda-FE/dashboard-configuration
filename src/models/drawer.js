import { find, cloneDeep, forEach, startsWith } from 'lodash';
import { panelControlPrefix, panelDataPrefix, panelSettingPrefix } from '~/utils/constants';
import { generateUUID } from '~/utils';

const defaultState = {
  visible: false,
  editChartId: '',
  drawerInfoMap: {}, // 所有图表配置信息
  codeVisible: false, // 代码编辑
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
      yield put({ type: 'updateState', payload: { visible: true, editChartId: chartId } });
    },
    * onDrawerChange({ payload }, { select, put }) {
      const { editChartId, drawerInfoMap } = yield select(state => state.biDrawer);
      yield put({ type: 'updateState',
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
      yield put({ type: 'updateState', payload: { visible: false, editChartId: '' } });
    },
    * deleteDrawer(_, { put, select }) { // 编辑时移除
      const { editChartId } = yield select(state => state.biDrawer);
      yield put({ type: 'biDashBoard/deleteChart', chartId: editChartId });
      yield put({ type: 'updateState', payload: { visible: false, editChartId: '' } });
    },
    * chooseChart({ chartType }, { put, select }) { // 编辑时移除
      const { drawerInfoMap, editChartId } = yield select(state => state.biDrawer);
      const drawerInfo = drawerInfoMap[editChartId];
      let tempPayload = {};
      if (chartType === drawerInfo.chartType) {
        forEach(drawerInfo, (value, key) => { // 移除填写的图表配置
          if (startsWith(key, panelDataPrefix)) {
            delete drawerInfo[key];
          }
        });
        yield yield put({ type: 'biDashBoard/deleteLayout', chartId: editChartId });
        tempPayload = { drawerInfoMap: { ...drawerInfoMap, [editChartId]: { ...drawerInfo, chartType: '' } } };
      } else {
        tempPayload = { drawerInfoMap: { ...drawerInfoMap, [editChartId]: { ...drawerInfo, chartType } } };
      }
      yield put({ type: 'updateState', payload: tempPayload });
    },
  },
  reducers: {
    updateState(state, { payload }) {
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
    chooseControl(state, { controlType }) {
      const { drawerInfoMap, editChartId } = state;
      const drawerInfo = drawerInfoMap[editChartId];
      if (controlType === drawerInfo.controlType) {
        forEach(drawerInfo, (value, key) => { // 移除填写的控件配置
          if (startsWith(key, panelControlPrefix)) {
            delete drawerInfo[key];
          }
        });
        return { ...state, drawerInfoMap: { ...drawerInfoMap, [editChartId]: { ...drawerInfo, controlType: '' } } };
      }
      return { ...state, drawerInfoMap: { ...drawerInfoMap, [editChartId]: { ...drawerInfo, controlType } } };
    },
    deleteDrawerInfo(state, { chartId }) {
      const { drawerInfoMap } = state;
      delete drawerInfoMap[chartId];
      return { ...state, drawerInfoMap: { ...drawerInfoMap } };
    },
    openCodeModal(state) {
      return { ...state, codeVisible: true };
    },
    closeCodeModal(state) {
      return { ...state, codeVisible: false };
    },
    submitCode(state, { settingInfo }) {
      const { drawerInfoMap, editChartId } = state;
      const drawerInfo = drawerInfoMap[editChartId];
      forEach(drawerInfo, (value, key) => { // 移除过去设置的的Echarts配置信息
        if (startsWith(key, panelSettingPrefix)) {
          delete drawerInfo[key];
        }
      });
      return { ...state, drawerInfoMap: { ...drawerInfoMap, [editChartId]: { ...drawerInfo, ...settingInfo } } };
    },
    reset() {
      return { ...cloneDeep(defaultState) };
    },
  },
};

