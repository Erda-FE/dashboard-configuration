import { maxBy, remove } from 'lodash';
import { createFlatStore } from '../cube';
import chartEditorStore from './chart-editor';

interface IState {
  isEditMode: boolean
  layout: any[]
  contextMap: any
}

const initState: IState = {
  isEditMode: false,
  layout: [],
  contextMap: {},
};

const getNewChartYPosition = (layout: any[]) => {
  const { y: maxY, h: maxH } = maxBy(layout, ({ y, h }) => y + h) || { y: 0, h: 0 };
  return maxY + maxH;
};

const dashBoardStore = createFlatStore({
  name: 'dashBoard',
  state: initState,
  effects: {
    async generateChart({ select }, viewId: string) {
      const layout = select(s => s.layout);
      const viewMap = chartEditorStore.getState(s => s.viewMap);
      const { chartType, controlType } = viewMap[viewId];
      let size;
      if (chartType) {
        size = { w: 8, h: 9 };
      } else if (controlType) {
        size = { w: 4, h: 1 };
      }
      dashBoardStore.updateLayout([...layout, { ...size, i: viewId, x: 0, y: getNewChartYPosition(layout) }]);
    },
    async saveEdit({ select }) {
      dashBoardStore.closeEdit();
      const layout = select(s => s.layout);
      const viewMap = chartEditorStore.getState(s => s.viewMap);
      return { layout, viewMap }; // 只输出外部需要的
    },
    async deleteView(_, viewId: string) {
      dashBoardStore.deleteLayout(viewId);
      chartEditorStore.deleteEditorInfo(viewId);
    },
  },
  reducers: {
    updateLayout(state, layout: any[]) {
      state.layout = layout;
    },
    closeEdit(state) {
      state.isEditMode = false;
    },
    openEdit(state) {
      state.isEditMode = true;
    },
    deleteLayout(state, viewId: string) {
      remove(state.layout, ({ i }) => viewId === i);
    },
    reset() {
      return initState;
    },
    updateContextMap(state, contextMap: any) {
      state.contextMap = contextMap;
    },
  },
});

export default dashBoardStore;
