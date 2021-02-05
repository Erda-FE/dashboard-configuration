import { createFlatStore } from '../cube';
import { TEXT_EN_MAP, TEXT_ZH_MAP } from '../constants';
import DcBoard from 'src/components/DcBoard';

type TextType = typeof TEXT_EN_MAP | typeof TEXT_ZH_MAP;

interface IState {
  configModalVisible: boolean;
  filters: DC_GLOBAL_FILTERS.Filter[];
}

const initState: IState = {
  configModalVisible: false,
  filters: [] as DC_GLOBAL_FILTERS.Filter[],
};

const globalFiltersStore = createFlatStore({
  name: 'globalFilters',
  state: initState,
  reducers: {
    toggleConfigModal(state, visible?: boolean) {
      state.configModalVisible = visible ?? !state.configModalVisible;
    },
  },
});


export default globalFiltersStore;
