import { createFlatStore } from '../cube';
import { TEXT_EN_MAP, TEXT_ZH_MAP } from '../constants';

type TextType = typeof TEXT_EN_MAP | typeof TEXT_ZH_MAP;
interface IState {
  isFullscreen: boolean;
  layout: any[];
  theme: string;
  locale: 'en' | 'zh';
  textMap: TextType;
}

const initState: IState = {
  isFullscreen: false,
  layout: [],
  theme: 'dice',
  locale: 'zh',
  textMap: TEXT_ZH_MAP,
};

const dashBoardStore = createFlatStore({
  name: 'dashBoard',
  state: initState,
  reducers: {
    toggleFullscreen(state, isFullscreen: boolean) {
      state.isFullscreen = isFullscreen;
    },
    reset() {
      return initState;
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
