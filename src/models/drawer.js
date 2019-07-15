import { cloneDeep, forEach, startsWith } from 'lodash';
import { generateUUID } from '../utils';
import { panelControlPrefix, panelSettingPrefix } from '../utils/constants';

const defaultState = {
  visible: false,
  editViewId: '',
  addMode: false,
  viewMap: {}, // 所有图表配置信息
  codeVisible: false, // 代码编辑
  viewCopy: {}, // 修改时用于恢复的复制对象
};

const newViewTpl = {
  viewType: 'chart:line',
  staticData: {
    xData: [],
    yData: [],
    metricData: {},
  },
  config: {
    options: {},
  },
};

export default {
  namespace: 'biEditor',
  state: cloneDeep(defaultState),
  effects: {
    * addEditor(_, { put, select }) {
      const viewId = `view-${generateUUID()}`;
      const { viewMap } = yield select(state => state.biEditor);

      yield yield put({
        type: 'updateState',
        payload: {
          visible: true,
          editViewId: viewId,
          addMode: true,
          viewMap: {
            ...viewMap,
            [viewId]: newViewTpl,
          },
        },
      });
      yield put({ type: 'biDashBoard/generateChart', viewId });
    },
    // 编辑时保存仅置空viewCopy即可，新增时保存无需处理
    * saveEditor(_, { put, select }) {
      // const { biEditor: { editViewId, viewMap, viewCopy }, biDashBoard: { layout } } = yield select(state => state);
      // const isExist = find(layout, ({ i }) => i === editViewId);
      // if (!isExist) { // 创建时取消就移除
      //   yield put({ type: 'biDashBoard/deleteView', viewId: editViewId });
      //   yield put({ type: 'updateState', payload: { visible: false, editViewId: '' } });
      // } else { // 编辑时取消恢复原有数据
      //   viewMap[editViewId] = viewCopy;
      // }
      yield put({ type: 'updateState', payload: { visible: false, addMode: false, editViewId: '', viewCopy: {} } });
    },
    // 表单变化时自动保存
    * onEditorChange({ payload }, { select, put }) {
      const { editViewId, viewMap } = yield select(state => state.biEditor);
      yield put({
        type: 'updateState',
        payload: {
          viewMap: {
            ...viewMap,
            [editViewId]: { ...viewMap[editViewId], ...payload },
          },
        },
      });
    },
    // 编辑时关闭，恢复数据并置空viewCopy
    * closeEditor(_, { put, select }) {
      const { biEditor: { editViewId, viewMap, viewCopy } } = yield select(state => state);
      // const isExist = find(layout, ({ i }) => i === editViewId);
      // if (!isExist) { // 创建时取消就移除
      //   yield put({ type: 'biDashBoard/deleteView', viewId: editViewId });
      //   yield put({ type: 'updateState', payload: { visible: false, editViewId: '' } });
      // } else { // 编辑时取消恢复原有数据
      // }
      viewMap[editViewId] = viewCopy;
      yield put({ type: 'updateState', payload: { visible: false, editViewId: '', viewMap: { ...viewMap }, viewCopy: {} } });
    },
    // 添加时关闭直接移除新建的
    * deleteEditor(_, { put, select }) {
      const { editViewId } = yield select(state => state.biEditor);
      yield put({ type: 'biDashBoard/deleteView', viewId: editViewId });
      yield put({ type: 'updateState', payload: { visible: false, editViewId: '' } });
    },
    * chooseViewType({ viewType }, { put, select }) { // 编辑时移除
      const { viewMap, editViewId } = yield select(state => state.biEditor);
      const drawerInfo = viewMap[editViewId];
      let tempPayload = {};
      if (viewType === drawerInfo.viewType) {
        // forEach(drawerInfo, (value, key) => { // 移除填写的图表配置
        //   if (startsWith(key, panelDataPrefix)) {
        //     delete drawerInfo[key];
        //   }
        // });
        yield yield put({ type: 'biDashBoard/deleteLayout', viewId: editViewId });
        tempPayload = { viewMap: { ...viewMap, [editViewId]: { ...drawerInfo, viewType: '' } } };
      } else {
        tempPayload = { viewMap: { ...viewMap, [editViewId]: { ...drawerInfo, viewType } } };
      }
      yield put({ type: 'updateState', payload: tempPayload });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    editView(state, { payload }) {
      const editViewId = payload;
      const viewCopy = cloneDeep(state.viewMap[editViewId]);
      return { ...state, visible: true, editViewId: payload, viewCopy };
    },
    updateViewInfo(state, { payload }) { // 修改标题时editViewId还是空的，所以自己传要更新的viewId
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
      const { viewMap, editViewId } = state;
      const drawerInfo = viewMap[editViewId];
      if (controlType === drawerInfo.controlType) {
        forEach(drawerInfo, (value, key) => { // 移除填写的控件配置
          if (startsWith(key, panelControlPrefix)) {
            delete drawerInfo[key];
          }
        });
        return { ...state, viewMap: { ...viewMap, [editViewId]: { ...drawerInfo, controlType: '' } } };
      }
      return { ...state, viewMap: { ...viewMap, [editViewId]: { ...drawerInfo, controlType } } };
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
      const { viewMap, editViewId } = state;
      const drawerInfo = viewMap[editViewId];
      forEach(drawerInfo, (value, key) => { // 移除过去设置的的Echarts配置信息
        if (startsWith(key, panelSettingPrefix)) {
          delete drawerInfo[key];
        }
      });
      return { ...state, viewMap: { ...viewMap, [editViewId]: { ...drawerInfo, ...settingInfo } } };
    },
    reset() {
      return { ...cloneDeep(defaultState) };
    },
  },
};

