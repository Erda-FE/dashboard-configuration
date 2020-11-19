import { map } from 'lodash';
import { createStore } from '../cube';
import {
  getMetaGroups,
  getMetaData,
} from '../services/data-config-metadata';

export interface IState {
  metaGroups: any[];
  metaConstantMap: MONITOR_COMMON_METADATA.MetaConstantMap;
  metaMetrics: MONITOR_COMMON_METADATA.MetaMetrics;
}

const initState: IState = {
  metaGroups: [],
  metaConstantMap: { types: {}, filters: [] } as MONITOR_COMMON_METADATA.MetaConstantMap,
  metaMetrics: [],
};

const monitorMetaDataStore = createStore({
  name: 'monitorMetaData',
  state: initState,
  effects: {
    async getMetaGroups({ call }, payload: Custom_Dashboard.IScope) {
      const groups = await call(getMetaGroups, payload);
      monitorMetaDataStore.reducers.convertGroups(groups);
    },
    async getMetaData({ call, update }, payload: Merge<{ groupId: string }, Custom_Dashboard.IScope>) {
      const metaData = await call(getMetaData, payload);
      const { meta, metrics } = metaData;
      const _metrics = metrics || [];

      update({
        metaConstantMap: meta,
        metaMetrics: _metrics,
      });
      return _metrics[0];
    },
  },
  reducers: {
    convertGroups(state, groups: any[]) {
      const convertGroups: any = (data: any[]) => map(data, ({ id, name, children }) => {
        if (children) {
          return { value: id, label: name, children: convertGroups(children) };
        } else {
          return { value: id, label: name };
        }
      });
      state.metaGroups = convertGroups(groups);
    },
  },
});

export default monitorMetaDataStore;
