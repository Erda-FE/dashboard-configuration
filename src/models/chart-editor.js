import { cloneDeep, forEach, startsWith, set } from 'lodash';
import { generateUUID } from '../utils';
import { panelControlPrefix, panelSettingPrefix } from '../utils/constants';

const defaultState = {
  visible: false,
  editChartId: '',
  addMode: false,
  chartMap: {}, // 所有图表配置信息
  codeVisible: false, // 代码编辑
  viewCopy: {}, // 修改时用于恢复的复制对象
};

const newChartTpl = {
  chartType: 'chart:line',
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
  namespace: 'chartEditor',
  state: cloneDeep(defaultState),
  effects: {
    * addEditor(_, { put, select }) {
      const viewId = `view-${generateUUID()}`;
      const { chartMap } = yield select(state => state.chartEditor);

      yield yield put({
        type: 'updateState',
        payload: {
          visible: true,
          editChartId: viewId,
          addMode: true,
          chartMap: {
            ...chartMap,
            [viewId]: newChartTpl,
          },
        },
      });
      yield put({ type: 'biDashBoard/generateChart', viewId });
    },
    // 编辑时保存仅置空viewCopy即可，新增时保存无需处理（将values置回源数据中）
    * saveEditor({ payload }, { put, select }) {
      const { editChartId, chartMap } = yield select(state => state.chartEditor);
      const editChart = cloneDeep(chartMap[editChartId]);
      const { option = {} } = payload;
      set(editChart, 'config.option', option);
      yield put({ type: 'updateState', payload: { chartMap: { ...chartMap, [editChartId]: editChart }, visible: false, addMode: false, editChartId: '', viewCopy: {} } });
    },
    // 表单变化时自动保存
    * onEditorChange({ payload }, { select, put }) {
      const { editChartId, chartMap } = yield select(state => state.chartEditor);
      yield put({
        type: 'updateState',
        payload: {
          chartMap: {
            ...chartMap,
            [editChartId]: { ...chartMap[editChartId], ...payload },
          },
        },
      });
    },
    // 编辑时关闭，恢复数据并置空viewCopy
    * closeEditor(_, { put, select }) {
      const { chartEditor: { editChartId, chartMap, viewCopy } } = yield select(state => state);
      // const isExist = find(layout, ({ i }) => i === editChartId);
      // if (!isExist) { // 创建时取消就移除
      //   yield put({ type: 'biDashBoard/deleteView', viewId: editChartId });
      //   yield put({ type: 'updateState', payload: { visible: false, editChartId: '' } });
      // } else { // 编辑时取消恢复原有数据
      // }
      chartMap[editChartId] = viewCopy;
      yield put({ type: 'updateState', payload: { visible: false, editChartId: '', chartMap: { ...chartMap }, viewCopy: {} } });
    },
    // 添加时关闭直接移除新建的
    * deleteEditor(_, { put, select }) {
      const { editChartId } = yield select(state => state.chartEditor);
      yield put({ type: 'biDashBoard/deleteView', viewId: editChartId });
      yield put({ type: 'updateState', payload: { visible: false, editChartId: '' } });
    },
    * chooseChartType({ chartType }, { put, select }) { // 编辑时移除
      const { chartMap, editChartId } = yield select(state => state.chartEditor);
      const drawerInfo = chartMap[editChartId];
      let tempPayload = {};
      if (chartType === drawerInfo.chartType) {
        // forEach(drawerInfo, (value, key) => { // 移除填写的图表配置
        //   if (startsWith(key, panelDataPrefix)) {
        //     delete drawerInfo[key];
        //   }
        // });
        yield yield put({ type: 'biDashBoard/deleteLayout', viewId: editChartId });
        tempPayload = { chartMap: { ...chartMap, [editChartId]: { ...drawerInfo, chartType: '' } } };
      } else {
        tempPayload = { chartMap: { ...chartMap, [editChartId]: { ...drawerInfo, chartType } } };
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
      const viewCopy = cloneDeep(state.chartMap[editChartId]);
      return { ...state, visible: true, editChartId: payload, viewCopy };
    },
    updateViewInfo(state, { payload }) { // 修改标题时editChartId还是空的，所以自己传要更新的viewId
      const { chartMap } = state;
      const { viewId, ...rest } = payload;
      if (!viewId) {
        return state;
      }
      chartMap[viewId] = {
        ...chartMap[viewId],
        ...rest,
      };
      return { ...state, chartMap: { ...chartMap } };
    },
    init(state, { chartMap }) {
      return { ...state, chartMap };
    },
    chooseControl(state, { controlType }) {
      const { chartMap, editChartId } = state;
      const drawerInfo = chartMap[editChartId];
      if (controlType === drawerInfo.controlType) {
        forEach(drawerInfo, (value, key) => { // 移除填写的控件配置
          if (startsWith(key, panelControlPrefix)) {
            delete drawerInfo[key];
          }
        });
        return { ...state, chartMap: { ...chartMap, [editChartId]: { ...drawerInfo, controlType: '' } } };
      }
      return { ...state, chartMap: { ...chartMap, [editChartId]: { ...drawerInfo, controlType } } };
    },
    deleteEditorInfo(state, { viewId }) {
      const { chartMap } = state;
      delete chartMap[viewId];
      return { ...state, chartMap: { ...chartMap } };
    },
    openCodeModal(state) {
      return { ...state, codeVisible: true };
    },
    closeCodeModal(state) {
      return { ...state, codeVisible: false };
    },
    submitCode(state, { settingInfo }) {
      const { chartMap, editChartId } = state;
      const drawerInfo = chartMap[editChartId];
      forEach(drawerInfo, (value, key) => { // 移除过去设置的的Echarts配置信息
        if (startsWith(key, panelSettingPrefix)) {
          delete drawerInfo[key];
        }
      });
      return { ...state, chartMap: { ...chartMap, [editChartId]: { ...drawerInfo, ...settingInfo } } };
    },
    reset() {
      return { ...cloneDeep(defaultState) };
    },
  },
};

