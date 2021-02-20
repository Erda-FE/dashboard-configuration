import { createFlatStore } from '../cube';
import DashboardStore from './dash-board';

const textMap = DashboardStore.getState((s) => s.textMap);
interface IState {
  configModalVisible: boolean;
  globalFilters: DC_GLOBAL_FILTERS.Filter[];
}

const initState: IState = {
  configModalVisible: true,
  globalFilters: [
    {
      key: 'time',
      name: 'time',
      type: 'time',
      label: textMap['time filter'],
      enable: true,
    },
  ] as DC_GLOBAL_FILTERS.Filter[],
};

const globalFiltersStore = createFlatStore({
  name: 'globalFilters',
  state: initState,
  reducers: {
    toggleConfigModal(state, visible?: boolean) {
      state.configModalVisible = visible ?? !state.configModalVisible;
    },
    submitFilters(state, filters: DC_GLOBAL_FILTERS.Filter[]) {
      state.globalFilters = filters;
    },
  },
});


export default globalFiltersStore;
