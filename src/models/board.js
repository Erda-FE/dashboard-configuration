import { maxBy, remove, get, cloneDeep } from 'lodash';

const defaultState = {
  isEdit: false,
  layout: [],
  dashboardType: '', // 布局类型
};

export default {
  namespace: 'biDashBoard',
  state: cloneDeep(defaultState), // 使用cloneDeep，因为layout在整个运作过程中涉及到引用，而immutable太重
  effects: {
    * initDashboard({ dashboardType, extra }, { put }) {
      yield yield put({ type: 'biDrawer/init', drawerInfoMap: get(extra, 'drawerInfoMap', {}) });
      yield yield put({ type: 'querySuccess', payload: { layout: get(extra, 'layout', []), dashboardType } });
    },
    * generateChart({ chartId }, { select, put }) {
      const { biDashBoard: { layout } } = yield select(state => state);
      layout.push({ i: chartId, x: 0, y: getNewChartYPostion(layout), w: 4, h: 6 });
      yield put({ type: 'querySuccess', payload: { layout: [...layout] } });
    },
    * saveEdit(_, { put, select }) {
      yield put({ type: 'querySuccess', payload: { isEdit: false } });
      const { biDashBoard: { layout }, biDrawer: { drawerInfoMap } } = yield select(state => state);
      return { layout, drawerInfoMap }; // 只输出外部需要的
    },
    * deleteChart({ chartId }, { select, put }) {
      const { layout } = yield select(state => state.biDashBoard);
      remove(layout, ({ i }) => chartId === i);
      yield put({ type: 'querySuccess', payload: { layout: [...layout] } });
      yield put({ type: 'biDrawer/deleteDrawerInfo', chartId });
    },
    * resetBoard(_, { put }) {
      yield put({ type: 'reset' });
      yield put({ type: 'biDrawer/reset' });
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, ...payload };
    },
    onLayoutChange(state, { layout }) {
      return { ...state, layout };
    },
    openEdit(state) {
      return { ...state, isEdit: true };
    },
    reset() {
      return { ...cloneDeep(defaultState) };
    },
  },
};

const getNewChartYPostion = (layout) => {
  const { y: maxY, h: maxH } = maxBy(layout, ({ y, h }) => y + h) || { y: 0, h: 0 };
  return maxY + maxH;
};

