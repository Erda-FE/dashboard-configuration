import { cloneDeep, forEach, merge, startsWith } from 'lodash';
import { createFlatStore } from '../cube';
import { genUUID } from '../common/utils';
import { panelControlPrefix, panelSettingPrefix } from '../utils/constants';
// eslint-disable-next-line import/no-cycle
import dashBoardStore from './dash-board';
import { CHARTS_INIT_CONFIG } from '../constants';

interface IState {
  pickChartModalVisible: boolean;
  editChartId?: string;
  addMode: boolean;
  viewMap: Record<string, DC.View>; // 所有图表配置信息
  viewCopy?: DC.View; // 修改时用于恢复的复制对象
  isTouched: boolean;
  dataConfigForm: any;
  baseConfigForm: any;
  /**
   *外部传入的时间
   *
   * @type {{ startTimeMs: number; endTimeMs: number }}
   * @memberof IState
   */
  timeSpan: { startTimeMs: number; endTimeMs: number };
  /**
   *编辑器上下文信息
   *
   * @type {Record<string, any>}
   * @memberof IState
   */
  editorContextMap: Record<string, any>;
}

const initState: IState = {
  pickChartModalVisible: false, // 添加图表时选择图表类型选择
  isTouched: false, // 数据是否变动，用于取消编辑时的判断
  editChartId: undefined,
  addMode: false,
  viewMap: {}, // 所有图表配置信息
  viewCopy: undefined, // 修改时用于恢复的复制对象
  dataConfigForm: null, // 存储数据配置表单对象
  baseConfigForm: null, // 存储基础配置表单对象
  timeSpan: { startTimeMs: 0, endTimeMs: 0 },
  editorContextMap: {},
};

const chartEditorStore = createFlatStore({
  name: 'chartEditor',
  state: initState,
  effects: {
    // 添加时关闭直接移除新建的图表
    async deleteEditor({ select }) {
      const editChartId = select((s) => s.editChartId);

      dashBoardStore.deleteView(editChartId);
      chartEditorStore.updateState({ editChartId: '' });
      chartEditorStore.setTouched(false);
    },
    // 编辑时关闭，恢复数据并置空 viewCopy
    async closeEditor({ select }) {
      const [
        editChartId,
        viewMap,
        viewCopy
      ] = select((s) => [
        s.editChartId,
        s.viewMap,
        s.viewCopy
      ]);
      const _viewMap = { ...viewMap };
      _viewMap[editChartId] = viewCopy;

      chartEditorStore.updateState({
        editChartId: '',
        viewMap: _viewMap,
        viewCopy: undefined,
      });
      chartEditorStore.setTouched(false);
    },
    async chooseChartType({ select }, chartType) { // 编辑时移除
      const [editChartId, viewMap] = select((s) => [s.editChartId, s.viewMap]);
      const drawerInfo = viewMap[editChartId];
      let tempPayload = {};
      if (chartType !== drawerInfo.chartType) {
        tempPayload = { viewMap: { ...viewMap, [editChartId]: { ...drawerInfo, chartType } } };
      }
      chartEditorStore.updateState(tempPayload);
    },
  },
  reducers: {
    updateState(state, payload: any) {
      return { ...state, ...payload };
    },
    /**
     *注册编辑器上下文信息
     *
     * @param {*} state
     * @param {Record<string, any>} contextMap
     */
    updateEditorContextMap(state, contexts: Array<{ name: string, context: any  }>) {
      contexts.forEach(({ name, context }) => {
        state.editorContextMap[`${name}`] = context;
      });
    },
    /**
     *完成图表编辑
     *
     * @param {*} state
     */
    saveEditor(state) {
      const { editChartId, viewCopy } = state;
      editChartId && viewCopy && (state.viewMap[editChartId] = viewCopy);
    },
    /**
     *实时更新图表数据，触发预览区更新
     *
     * @param {*} state
     * @param {*} payload
     */
    updateEditor(state, payload: Partial<DC.View>) {
      state.isTouched = true;
      merge(state.viewCopy, payload);
    },
    /**
     *重置图表编辑器初始状态
     *
     * @param {*} state
     */
    resetEditor(state) {
      state.viewCopy = undefined;
      state.editChartId = undefined;
      state.isTouched = false;
    },
    // 新增图表
    addView(state, chartType: DC.ViewType) {
      const viewId = `view-${genUUID(8)}`;
      state.editChartId = viewId;
      state.addMode = true;
      state.viewCopy = CHARTS_INIT_CONFIG[chartType] as unknown as DC.View;
      // 在 Dashboard 新增 view 占位
      dashBoardStore.generateChart(viewId);
    },
    // 编辑图表
    editView(state, editChartId: string) {
      state.editChartId = editChartId;
      state.viewCopy = cloneDeep(state.viewMap[editChartId]);
    },
    // 修改标题时editChartId还是空的，所以自己传要更新的viewId
    updateViewInfo(state, payload: any) {
      const { viewId, ...rest } = payload;
      if (viewId) {
        state.viewMap[viewId] = {
          ...state.viewMap[viewId],
          ...rest,
        };
      }
    },
    updateViewMap(state, viewMap: Record<string, DC.View>) {
      state.viewMap = viewMap;
    },
    init(state, viewMap) {
      state.viewMap = viewMap;
    },
    chooseControl(state, controlType) {
      const { viewMap, editChartId } = state;
      const drawerInfo = viewMap[editChartId];
      if (controlType === drawerInfo.controlType) {
        forEach(drawerInfo, (_, key) => { // 移除填写的控件配置
          if (startsWith(key, panelControlPrefix)) {
            delete drawerInfo[key];
          }
        });
        return { ...state, viewMap: { ...viewMap, [editChartId]: { ...drawerInfo, controlType: '' } } };
      }
      return { ...state, viewMap: { ...viewMap, [editChartId]: { ...drawerInfo, controlType } } };
    },
    deleteEditorInfo(state, viewId: string) {
      delete state.viewMap[viewId];
    },
    openCodeModal(state) {
      return { ...state, codeVisible: true };
    },
    closeCodeModal(state) {
      return { ...state, codeVisible: false };
    },
    submitCode(state, settingInfo) {
      const { viewMap, editChartId } = state;
      const drawerInfo = viewMap[editChartId];
      forEach(drawerInfo, (_, key) => { // 移除过去设置的的Echarts配置信息
        if (startsWith(key, panelSettingPrefix)) {
          delete drawerInfo[key];
        }
      });
      return { ...state, viewMap: { ...viewMap, [editChartId]: { ...drawerInfo, ...settingInfo } } };
    },
    reset() {
      return { ...initState };
    },
    setTouched(state, isTouched: boolean) {
      state.isTouched = isTouched;
    },
    setPickChartModalVisible(state, pickChartModalVisible: boolean) {
      state.pickChartModalVisible = pickChartModalVisible;
    },
    setDataConfigForm(state, dataConfigForm: any) {
      state.dataConfigForm = dataConfigForm;
    },
    setBaseConfigForm(state, baseConfigForm: any) {
      state.baseConfigForm = baseConfigForm;
    },
  },
});

export default chartEditorStore;
