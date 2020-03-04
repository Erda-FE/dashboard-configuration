import { cloneDeep, forEach, startsWith } from 'lodash';
import { generateUUID } from '../utils';
import { panelControlPrefix, panelSettingPrefix } from '../utils/constants';
import { NEW_CHART_VIEW_MAP } from '../constants';

const defaultState = {
  visible: false,
  editChartId: '',
  addMode: false,
  viewMap: {}, // 所有图表配置信息
  codeVisible: false, // 代码编辑
  viewCopy: {}, // 修改时用于恢复的复制对象
  isTouched: false,
};

export default {
  namespace: 'chartEditor',
  state: cloneDeep(defaultState),
  effects: {
    * addEditor(_, { put, select }) {
      const viewId = `view-${generateUUID()}`;
      const { viewMap } = yield select(state => state.chartEditor);

      yield put({
        type: 'updateState',
        payload: {
          visible: true,
          editChartId: viewId,
          addMode: true,
          viewMap: {
            ...viewMap,
            [viewId]: NEW_CHART_VIEW_MAP,
          },
        },
      });
      yield put({ type: 'dashBoard/generateChart', viewId });
    },
    // 编辑时保存仅置空viewCopy即可，新增时保存无需处理（将values置回源数据中）
    * saveEditor({ payload }, { put, select }) {
      const { editChartId, viewMap } = yield select(state => state.chartEditor);
      const editChart = cloneDeep(viewMap[editChartId]);
      yield put({
        type: 'updateState',
        payload: {
          viewMap: { ...viewMap, [editChartId]: { ...editChart, ...payload } },
          visible: false,
          addMode: false,
          editChartId: '',
          viewCopy: {},
        },
      });
      yield put({ type: 'setTouched', payload: false });
    },
    // 表单变化时自动保存
    * onEditorChange({ payload }, { select, put }) {
      const { editChartId, viewMap } = yield select(state => state.chartEditor);
      yield put({
        type: 'updateState',
        payload: {
          viewMap: {
            ...viewMap,
            [editChartId]: { ...viewMap[editChartId], ...payload },
          },
        },
      });
    },
    // 编辑时关闭，恢复数据并置空viewCopy
    * closeEditor(_, { put, select }) {
      const { chartEditor: { editChartId, viewMap, viewCopy } } = yield select(state => state);
      // const isExist = find(layout, ({ i }) => i === editChartId);
      // if (!isExist) { // 创建时取消就移除
      //   yield put({ type: 'dashBoard/deleteView', viewId: editChartId });
      //   yield put({ type: 'updateState', payload: { visible: false, editChartId: '' } });
      // } else { // 编辑时取消恢复原有数据
      // }
      viewMap[editChartId] = viewCopy;
      yield put({ type: 'updateState', payload: { visible: false, editChartId: '', viewMap: { ...viewMap }, viewCopy: {} } });
      yield put({ type: 'setTouched', payload: false });
    },
    // 添加时关闭直接移除新建的
    * deleteEditor(_, { put, select }) {
      const { editChartId } = yield select(state => state.chartEditor);
      yield put({ type: 'dashBoard/deleteView', viewId: editChartId });
      yield put({ type: 'updateState', payload: { visible: false, editChartId: '' } });
      yield put({ type: 'setTouched', payload: false });
    },
    * chooseChartType({ chartType }, { put, select }) { // 编辑时移除
      const { viewMap, editChartId } = yield select(state => state.chartEditor);
      const drawerInfo = viewMap[editChartId];
      let tempPayload = {};
      if (chartType === drawerInfo.chartType) {
        // forEach(drawerInfo, (value, key) => { // 移除填写的图表配置
        //   if (startsWith(key, panelDataPrefix)) {
        //     delete drawerInfo[key];
        //   }
        // });
        // yield put({ type: 'dashBoard/deleteLayout', viewId: editChartId });
        // tempPayload = { viewMap: { ...viewMap, [editChartId]: { ...drawerInfo, chartType: '' } } };
      } else {
        tempPayload = { viewMap: { ...viewMap, [editChartId]: { ...drawerInfo, chartType } } };
      }
      yield put({ type: 'updateState', payload: tempPayload });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    editView(state, { payload }) {
      const editChartId = payload;
      const viewCopy = cloneDeep(state.viewMap[editChartId]);
      return { ...state, visible: true, editChartId: payload, viewCopy };
    },
    updateViewInfo(state, { payload }) { // 修改标题时editChartId还是空的，所以自己传要更新的viewId
      const { viewMap } = state;
      const { viewId, ...rest } = payload;
      if (!viewId) {
        return state;
      }
      viewMap[viewId] = {
        ...viewMap[viewId],
        ...rest,
      };
      return { ...state, viewMap: { ...viewMap } };
    },
    init(state, { viewMap }) {
      return { ...state, viewMap };
    },
    chooseControl(state, { controlType }) {
      const { viewMap, editChartId } = state;
      const drawerInfo = viewMap[editChartId];
      if (controlType === drawerInfo.controlType) {
        forEach(drawerInfo, (value, key) => { // 移除填写的控件配置
          if (startsWith(key, panelControlPrefix)) {
            delete drawerInfo[key];
          }
        });
        return { ...state, viewMap: { ...viewMap, [editChartId]: { ...drawerInfo, controlType: '' } } };
      }
      return { ...state, viewMap: { ...viewMap, [editChartId]: { ...drawerInfo, controlType } } };
    },
    deleteEditorInfo(state, { viewId }) {
      const { viewMap } = state;
      delete viewMap[viewId];
      return { ...state, viewMap: { ...viewMap } };
    },
    openCodeModal(state) {
      return { ...state, codeVisible: true };
    },
    closeCodeModal(state) {
      return { ...state, codeVisible: false };
    },
    submitCode(state, { settingInfo }) {
      const { viewMap, editChartId } = state;
      const drawerInfo = viewMap[editChartId];
      forEach(drawerInfo, (value, key) => { // 移除过去设置的的Echarts配置信息
        if (startsWith(key, panelSettingPrefix)) {
          delete drawerInfo[key];
        }
      });
      return { ...state, viewMap: { ...viewMap, [editChartId]: { ...drawerInfo, ...settingInfo } } };
    },
    reset() {
      return { ...cloneDeep(defaultState) };
    },
    setTouched(state, { payload }) {
      return { ...state, isTouched: payload };
    },
  },
};
