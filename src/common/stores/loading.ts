import { createStore, use } from 'src/cube';

const loadingStore = createStore({
  name: 'loading',
  state: {},
  reducers: {
    setLoading(state, storeName: string, effectName, status: boolean) {
      state[storeName] = state[storeName] || {};
      state[storeName][effectName] = status;
    },
  },
});

/**
 * @deprecated use useLoading instead
 */
function useSpace<T>(store: T & { name: string }): EffectKeys<ValueOf<T, 'effects' | '_effects'>> {
  const loadingSpace = loadingStore.useStore((s) => s[store.name]) || {};
  // add proxy to avoid return undefined in isLoading
  const loadingSpaceProxy = new Proxy(loadingSpace, {
    get: (target, propKey) => {
      return !!Reflect.get(target, propKey);
    },
  });
  return loadingSpaceProxy;
}

type EffectKeys<T> = {
  [K in keyof T]: boolean;
};

type EKs<T> = keyof EffectKeys<ValueOf<T, 'effects'> | ValueOf<T, '_effects'>>;

export function useLoading<T>(store: T & { name: string }, effectNames: Array<EKs<T>>): boolean[] {
  return loadingStore.useStore((s) => effectNames.map((n: EKs<T>) => (s[store.name] && s[store.name][n]) || false));
}

use({
  beforeEffect({ storeName, effectName }) {
    loadingStore.reducers.setLoading(storeName, effectName, true);
  },
  afterEffect({ storeName, effectName }) {
    loadingStore.reducers.setLoading(storeName, effectName, false);
  },
});

export default {
  ...loadingStore,
  useSpace,
};
