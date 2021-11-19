import { createFlatStore } from '../cube';
import DashboardStore from './dash-board';

const textMap = DashboardStore.getState((s) => s.textMap);

interface IState {
  configModalVisible: boolean;
  globalFilters: DC_GLOBAL_FILTERS.Filter[];
  globalVariable: Record<string, any>;
}

const initState: IState = {
  configModalVisible: false,
  globalFilters: [
    {
      key: 'time',
      name: 'time',
      type: 'time',
      label: textMap['select time'],
      enable: false,
    },
  ] as DC_GLOBAL_FILTERS.Filter[],
  globalVariable: {},
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
    updateGlobalVariable(state, globalVariable: Record<string, any>) {
      state.globalVariable = { ...state.globalVariable, ...globalVariable };
    },
  },
});

export default globalFiltersStore;
