import { maxBy, remove } from 'lodash';
import { createFlatStore } from '../cube';
// eslint-disable-next-line import/no-cycle
import chartEditorStore from './chart-editor';
import { TEXT_EN_MAP, TEXT_ZH_MAP } from '../constants';

type TextType = typeof TEXT_EN_MAP | typeof TEXT_ZH_MAP;
interface IState {
  isEditMode: boolean;
  isFullscreen: boolean;
  layout: any[];
  contextMap: any;
  theme: string;
  locale: 'en' | 'zh';
  textMap: TextType;
}

const initState: IState = {
  isEditMode: false,
  isFullscreen: false,
  layout: [],
  contextMap: {},
  theme: 'dice',
  locale: 'zh',
  textMap: TEXT_ZH_MAP,
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
      const layout = select((s) => s.layout);
      const viewMap = chartEditorStore.getState((s) => s.viewMap);
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
      dashBoardStore.setEditMode(false);
      const layout = select((s) => s.layout);
      const viewMap = chartEditorStore.getState((s) => s.viewMap);
      return { layout, viewMap }; // 只输出外部需要的
    },
    async deleteView(_, viewId: string) {
      dashBoardStore.deleteLayout(viewId);
      chartEditorStore.deleteEditorInfo(viewId);
    },
  },
  reducers: {
    toggleFullscreen(state, isFullscreen?: boolean) {
      state.isFullscreen = isFullscreen || !state.isFullscreen;
    },
    updateLayout(state, layout: any[]) {
      state.layout = layout;
    },
    setEditMode(state, status: boolean) {
      state.isEditMode = status;
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
    setLocale(state, key: 'en' | 'zh') {
      state.locale = key;
      state.textMap = key === 'en' ? TEXT_EN_MAP : TEXT_ZH_MAP;
    },
    setTheme(state, theme?: string) {
      state.theme = theme || 'dice';
    },
  },
});

export const getLocale = () => dashBoardStore.getState((s) => s.locale);
export const { setLocale } = dashBoardStore;

export const getTheme = () => dashBoardStore.getState((s) => s.theme);
export const { setTheme } = dashBoardStore;

export default dashBoardStore;
