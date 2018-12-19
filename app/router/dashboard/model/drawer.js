export default {
  namespace: 'biDrawer',
  state: {
    visible: false,
  },
  effects: {
  },
  reducers: {
    openDrawer(state) {
      return { ...state, visible: true };
    },
    closeDrawer(state) {
      return { ...state, visible: false };
    },
  },
};
