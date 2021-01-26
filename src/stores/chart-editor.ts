import { cloneDeep, forEach, maxBy, remove, omit, some } from 'lodash';
import { produce } from 'immer';
import { createFlatStore } from '../cube';
import { genUUID } from '../common/utils';
import { CHARTS_INIT_CONFIG } from '../constants';

const getNewChartYPosition = (items?: DC.PureLayoutItem[]): number => {
  const { y: maxY, h: maxH } = maxBy(items, ({ y, h }) => y + h) || { y: 0, h: 0 };
  return maxY + maxH;
};

const updateLayout = (id: string, items: DC.PureLayoutItem[]): DC.PureLayoutItem[] => {
  if (some(items, { i: id })) return items;

  const size = { w: 8, h: 9, minW: 4, minH: 3 };
  return [
    ...items,
    {
      i: id,
      x: 0,
      y: getNewChartYPosition(items),
      ...size,
    },
  ];
};

interface IState {
  pickChartModalVisible: boolean;
  isEditMode: boolean;
  pureLayout: DC.PureLayoutItem[];
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
  isFullscreen: false,
  pickChartModalVisible: false, // 添加图表时选择图表类型选择
  isTouched: false, // 数据是否变动，用于取消编辑时的判断
  isEditMode: false,
  pureLayout: [],
  viewMap: {}, // 所有图表配置信息
  editChartId: undefined,
  viewCopy: undefined, // 修改时用于恢复的复制对象
  timeSpan: { startTimeMs: 0, endTimeMs: 0 },
  editorContextMap: {},
};

const chartEditorStore = createFlatStore({
  name: 'chartEditor',
  state: initState,
  reducers: {
    toggleFullscreen(state, isFullscreen: boolean) {
      state.isFullscreen = isFullscreen;
    },
    updateState(state, payload: any) {
      return { ...state, ...payload };
    },
    setEditMode(state, status: boolean) {
      state.isEditMode = status;
    },
    deleteView(state, viewId: string) {
      state.pureLayout && remove(state.pureLayout, ({ i }) => i === viewId);
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
      const { editChartId, viewCopy, pureLayout } = state;
      if (editChartId && viewCopy) {
        state.viewMap[editChartId] = viewCopy;
        state.pureLayout = updateLayout(editChartId, pureLayout);
      }
    },
    updateLayout(state, pureLayout: DC.PureLayoutItem[]) {
      state.pureLayout = pureLayout;
    },
    /**
     *实时更新图表数据，触发预览区更新
     *
     * @param {*} state
     * @param {*} payload
     */
    updateEditor(state, payload: Partial<DC.View>) {
      state.isTouched = true;
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
      state.viewCopy = CHARTS_INIT_CONFIG[chartType] as unknown as DC.View;
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
      return { layout: state.pureLayout, viewMap: state.viewMap }; // 只输出外部需要的
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
