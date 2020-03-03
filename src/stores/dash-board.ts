import { createStore } from 'src/cube';
import { maxBy, remove } from 'lodash';
import chartEditorStore from './chart-editor';

interface IState {
  isEditMode: boolean;
  layout: any[];
}

const initState: IState = {
  isEditMode: false,
  layout: [],
};

const getNewChartYPosition = (layout: any[]) => {
  const { y: maxY, h: maxH } = maxBy(layout, ({ y, h }) => y + h) || { y: 0, h: 0 };
  return maxY + maxH;
};


const dashBoardStore = createStore({
  name: 'dashBoard',
  state: initState,
  effects: {
    async generateChart({ select }, viewId: string) {
      const layout = select(s => s.layout);
      const viewMap = chartEditorStore.getState(s => s.viewMap);
      const { chartType, controlType } = viewMap[viewId];
      if (chartType) {
        layout.push({ i: viewId, x: 0, y: getNewChartYPosition(layout), w: 4, h: 6 });
      } else if (controlType) {
        layout.push({ i: viewId, x: 0, y: getNewChartYPosition(layout), w: 2, h: 1 });
      }
      dashBoardStore.reducers.updateLayout([...layout]);
    },
    async saveEdit({ select }) {
      dashBoardStore.reducers.changeEditMode(false);
      const layout = select(s => s.layout);
      const viewMap = chartEditorStore.getState(s => s.viewMap);
      return { layout, viewMap }; // 只输出外部需要的
    },
    async deleteView(_, viewId: string) {
      dashBoardStore.reducers.deleteLayout(viewId);
      chartEditorStore.reducers.deleteEditorInfo(viewId);
    },
  },
  reducers: {
    updateLayout(state, layout: any[]) {
      state.layout = layout;
    },
    changeEditMode(state, isEditMode: boolean) {
      state.isEditMode = isEditMode;
    },
    deleteLayout(state, viewId: string) {
      remove(state.layout, ({ i }) => viewId === i);
    },
    reset() {
      return initState;
    },
  },
});

export default dashBoardStore;
