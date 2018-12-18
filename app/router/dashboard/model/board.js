const defaultLayout = [
  { i: 'a', x: 0, y: 0, w: 1, h: 6 },
  { i: 'b', x: 1, y: 0, w: 3, h: 6, minW: 2, maxW: 4 },
  { i: 'c', x: 4, y: 0, w: 1, h: 6 },
];

export default {
  namespace: 'biBoard',
  state: {
    layout: defaultLayout,
  },
  effects: {
  },
  reducers: {
    onLayoutChange(state, { layout }) {
      return { ...state, layout };
    },
  },
};
