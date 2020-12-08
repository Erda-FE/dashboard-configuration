import { createFlatStore } from '../cube';
import { cloneDeep, forEach, startsWith } from 'lodash';
import { genUUID } from '../common/utils';
import { panelControlPrefix, panelSettingPrefix } from '../utils/constants';
// eslint-disable-next-line import/no-cycle
import dashBoardStore from './dash-board';
import { CHARTS_INIT_CONFIG } from '../constants';

interface IState {
  pickChartModalVisible: boolean;
  editChartId: string;
  addMode: false;
  viewMap: Record<string, DC.View>; // 所有图表配置信息
  codeVisible: boolean; // 代码编辑
  viewCopy: any; // 修改时用于恢复的复制对象
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
}

const initState: IState = {
  pickChartModalVisible: false, // 添加图表时选择图表类型选择
  isTouched: false, // 数据是否变动，用于取消编辑时的判断
  editChartId: '',
  addMode: false,
  viewMap: {}, // 所有图表配置信息
  codeVisible: false, // 代码编辑，暂时没用到
  viewCopy: {}, // 修改时用于恢复的复制对象
  dataConfigForm: null, // 存储数据配置表单对象
  baseConfigForm: null, // 存储基础配置表单对象
  timeSpan: { startTimeMs: 0, endTimeMs: 0 },
};

const chartEditorStore = createFlatStore({
  name: 'chartEditor',
  state: initState,
  effects: {
    async addEditor({ select }, chartType: DC.ViewType) {
      const viewId = `view-${genUUID(8)}`;
      const viewMap = select((s) => s.viewMap);

      chartEditorStore.updateState({
        editChartId: viewId,
        addMode: true,
        viewMap: {
          ...viewMap,
          [viewId]: CHARTS_INIT_CONFIG[chartType],
        },
      });
      dashBoardStore.generateChart(viewId); // 在布局中生成一个占位
    },
    // 添加时关闭直接移除新建的图表
    async deleteEditor({ select }) {
      const editChartId = select((s) => s.editChartId);

      dashBoardStore.deleteView(editChartId);
      chartEditorStore.updateState({ editChartId: '' });
      chartEditorStore.setTouched(false);
    },
    // 编辑时保存仅置空viewCopy即可，新增时保存无需处理（将values置回源数据中）
    async saveEditor({ select }, payload) {
      const [editChartId, viewMap] = select((s) => [s.editChartId, s.viewMap]);
      const editChart = cloneDeep(viewMap[editChartId]);

      chartEditorStore.updateState({
        viewMap: { ...viewMap, [editChartId]: { ...editChart, ...payload } },
        addMode: false,
        editChartId: '',
        viewCopy: {},
      });
      chartEditorStore.setTouched(false);
    },
    // 表单变化时自动保存
    async onEditorChange({ select }, payload) {
      const [editChartId, viewMap] = select((s) => [s.editChartId, s.viewMap]);
      const _payload = { ...payload };

      chartEditorStore.updateState({
        viewMap: {
          ...viewMap,
          [editChartId]: { ...viewMap[editChartId], ..._payload },
        },
      });
    },
    // 编辑时关闭，恢复数据并置空viewCopy
    async closeEditor({ select }) {
      const [editChartId, viewMap, viewCopy] = select((s) => [s.editChartId, s.viewMap, s.viewCopy]);
      const _viewMap = { ...viewMap };
      _viewMap[editChartId] = viewCopy;

      chartEditorStore.updateState({
        editChartId: '',
        viewMap: _viewMap,
        viewCopy: {},
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
    editView(state, editChartId: string) {
      const viewCopy = cloneDeep(state.viewMap[editChartId]);
      return { ...state, editChartId, viewCopy };
    },
    updateViewInfo(state, payload: any) { // 修改标题时editChartId还是空的，所以自己传要更新的viewId
      const { viewId, ...rest } = payload;
      if (viewId) {
        state.viewMap[viewId] = {
          ...state.viewMap[viewId],
          ...rest,
        };
      }
    },
    updateViewMap(state, viewMap: any) {
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
