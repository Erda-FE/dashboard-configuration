const defaultLayout = [
  { i: 'a', x: 0, y: 0, w: 4, h: 6 },
  { i: 'b', x: 4, y: 0, w: 5, h: 6 },
  { i: 'c', x: 9, y: 0, w: 3, h: 6 },
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
