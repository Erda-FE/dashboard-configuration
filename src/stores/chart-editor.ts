import { cloneDeep, forEach, maxBy, remove, omit } from 'lodash';
import { produce } from 'immer';
import { createFlatStore } from '../cube';
import { genUUID } from '../common/utils';
import { CHARTS_INIT_CONFIG } from '../constants';

const getNewChartYPosition = (layout: any[]) => {
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const { y: maxY, h: maxH } = maxBy(layout, ({ y, h }) => y + h) || { y: 0, h: 0 };
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  return maxY + maxH;
};

interface IState {
  pickChartModalVisible: boolean;
  isEditMode: boolean;
  layout: DC.PureLayoutItem[];
  editChartId?: string;
  viewMap: Record<string, DC.View>; // 所有图表配置信息
  viewCopy?: DC.View; // 修改时用于恢复的复制对象
  isTouched: boolean;
  isFullscreen: boolean;
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
  isEditMode: false,
  layout: [],
  editChartId: undefined,
  isFullscreen: false,
  viewMap: {}, // 所有图表配置信息
  viewCopy: undefined, // 修改时用于恢复的复制对象
  timeSpan: { startTimeMs: 0, endTimeMs: 0 },
  editorContextMap: {},
};

const chartEditorStore = createFlatStore({
  name: 'chartEditor',
  state: initState,
  reducers: {
    toggleFullscreen(state, isFullscreen?: boolean) {
      state.isFullscreen = isFullscreen || !state.isFullscreen;
    },
    updateState(state, payload: any) {
      return { ...state, ...payload };
    },
    setEditMode(state, status: boolean) {
      state.isEditMode = status;
    },
    deleteView(_, viewId: string) {
      chartEditorStore.deleteLayout(viewId);
      chartEditorStore.deleteEditorInfo(viewId);
    },
    deleteLayout(state, viewId: string) {
      remove(state.layout, ({ i }) => i === viewId);
    },
    deleteEditorInfo(state, viewId: string) {
      state.viewMap = omit(state.viewMap, [viewId]);
    },
    /**
     *注册编辑器上下文信息
     *
     * @param {*} state
     * @param {Record<string, any>} contextMap
     */
    updateEditorContextMap(state, contexts: Array<{ name: string; context: any }>) {
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
      if (editChartId && viewCopy) {
        state.viewMap[editChartId] = viewCopy;
        chartEditorStore.generateLayout({ id: editChartId });
      }
    },
    generateLayout(state, { id }: { id: string }) {
      const { layout } = state;
      const size = { w: 8, h: 9 };

      chartEditorStore.updateLayout([
        ...layout,
        {
          ...size,
          i: id,
          x: 0,
          y: getNewChartYPosition(layout),
        },
      ]);
    },
    updateLayout(state, layout: any[]) {
      state.layout = layout;
    },
    /**
     *实时更新图表数据，触发预览区更新
     *
     * @param {*} state
     * @param {*} payload
     */
    updateEditor(state, payload: Partial<DC.View>) {
      state.isTouched = true;
      // state.viewCopy.config = {};
      state.viewCopy = produce((state.viewCopy || {}) as DC.View, (draft) => {
        forEach(payload, (v, k) => { draft[k] = v; });
      });
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
      state.viewCopy = {
        version: 'v2',
        ...(CHARTS_INIT_CONFIG[chartType] as unknown as DC.View),
      };
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
    saveEdit(state) {
      chartEditorStore.setEditMode(false);
      return { layout: state.layout, viewMap: state.viewMap }; // 只输出外部需要的
    },
    updateViewMap(state, viewMap: Record<string, DC.View>) {
      state.viewMap = viewMap;
    },
    reset() {
      return initState;
    },
    setTouched(state, isTouched: boolean) {
      state.isTouched = isTouched;
    },
    setPickChartModalVisible(state, pickChartModalVisible: boolean) {
      state.pickChartModalVisible = pickChartModalVisible;
    },
  },
});

export default chartEditorStore;
