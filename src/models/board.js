import { maxBy, remove, cloneDeep } from 'lodash';

const defaultState = {
  isEdit: false,
  layout: [],
};

export default {
  namespace: 'dashBoard',
  state: cloneDeep(defaultState), // 使用cloneDeep，因为layout在整个运作过程中涉及到引用，而immutable太重
  effects: {
    // * initDashboard({ layout }, { put, select }) {
    //   // const { layout } = yield select(state => state.dashBoard);
    //   // if (!isEmpty(layout)) { // 清空layout,防止在同一个页面不停的reload时出错
    //   //   yield yield put({ type: 'updateState', payload: { layout: [] } });
    //   // }
    //   // yield yield put({ type: 'chartEditor/init', chartMap: get(extra, 'chartMap', {}) });
    //   // yield yield put({ type: 'linkSetting/init', chartMap: get(extra, 'linkMap', {}) });
    //   yield yield put({ type: 'updateState', payload: { layout } });
    // },
    * generateChart({ viewId }, { select, put }) {
      const { dashBoard: { layout }, chartEditor: { chartMap } } = yield select(state => state);
      const { chartType, controlType } = chartMap[viewId];
      if (chartType) {
        layout.push({ i: viewId, x: 0, y: getNewChartYPosition(layout), w: 4, h: 6 });
      } else if (controlType) {
        layout.push({ i: viewId, x: 0, y: getNewChartYPosition(layout), w: 2, h: 1 });
      }
      yield put({ type: 'updateState', payload: { layout: [...layout] } });
    },
    * saveEdit(_, { put, select }) {
      yield put({ type: 'updateState', payload: { isEdit: false } });
      const {
        dashBoard: { layout },
        chartEditor: { chartMap },
        linkSetting: { linkMap },
      } = yield select(state => state);
      return { layout, chartMap, linkMap }; // 只输出外部需要的
    },
    * deleteView({ viewId }, { put }) {
      yield put({ type: 'deleteLayout', viewId });
      yield put({ type: 'chartEditor/deleteEditorInfo', viewId });
      // yield put({ type: 'linkSetting/deleteLinkMap', linkId: viewId });
    },
    // * resetBoard(_, { put }) {
    //   yield put({ type: 'reset' });
    //   yield put({ type: 'chartEditor/reset' });
    //   yield put({ type: 'linkSetting/reset' });
    // },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    openEdit(state) {
      return { ...state, isEdit: true };
    },
    deleteLayout(state, { viewId }) {
      const { layout } = state;
      remove(layout, ({ i }) => viewId === i);
      return { ...state, layout: [...layout] };
    },
    reset() {
      return { ...cloneDeep(defaultState) };
    },
  },
};

const getNewChartYPosition = (layout) => {
  const { y: maxY, h: maxH } = maxBy(layout, ({ y, h }) => y + h) || { y: 0, h: 0 };
  return maxY + maxH;
};

