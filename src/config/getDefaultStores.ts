import { createStore } from '../cube';

export const dataConfigMetaDataStore = createStore({
  name: 'dataConfigMetaData',
  state: {
    metaGroups: [],
    metaConstantMap: { types: {}, filters: [] },
    metaMetrics: [],
  },
  effects: {
    async getMetaGroups() { return await (() => {})(); },
    async getMetaData() { return await (() => [])(); },
  },
});

export const dynamicFilterMetaDataStore = createStore({
  name: 'dynamicFilterMetaData',
  state: {
    metaGroups: [],
    metaConstantMap: { types: {}, filters: [] },
    metaMetrics: [],
  },
  effects: {
    async getMetaGroups() { return await (() => {})(); },
    async getMetaData() { return await (() => [])(); },
  },
});
