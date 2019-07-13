import { maxBy, remove, get, cloneDeep, isEmpty } from 'lodash';

const defaultState = {
  isEdit: false,
  layout: [],
};

export default {
  namespace: 'biDashBoard',
  state: cloneDeep(defaultState), // 使用cloneDeep，因为layout在整个运作过程中涉及到引用，而immutable太重
  effects: {
    // * initDashboard({ layout }, { put, select }) {
    //   // const { layout } = yield select(state => state.biDashBoard);
    //   // if (!isEmpty(layout)) { // 清空layout,防止在同一个页面不停的reload时出错
    //   //   yield yield put({ type: 'updateState', payload: { layout: [] } });
    //   // }
    //   // yield yield put({ type: 'biEditor/init', viewMap: get(extra, 'viewMap', {}) });
    //   // yield yield put({ type: 'linkSetting/init', viewMap: get(extra, 'linkMap', {}) });
    //   yield yield put({ type: 'updateState', payload: { layout } });
    // },
    * generateChart({ viewId }, { select, put }) {
      const { biDashBoard: { layout }, biEditor: { viewMap } } = yield select(state => state);
      const { viewType, controlType } = viewMap[viewId];
      if (viewType) {
        layout.push({ i: viewId, x: 0, y: getNewChartYPostion(layout), w: 4, h: 6 });
      } else if (controlType) {
        layout.push({ i: viewId, x: 0, y: getNewChartYPostion(layout), w: 2, h: 1 });
      }
      yield put({ type: 'updateState', payload: { layout: [...layout] } });
    },
    * saveEdit(_, { put, select }) {
      yield put({ type: 'updateState', payload: { isEdit: false } });
      const {
        biDashBoard: { layout },
        biEditor: { viewMap },
        linkSetting: { linkMap },
      } = yield select(state => state);
      return { layout, viewMap, linkMap }; // 只输出外部需要的
    },
    * deleteView({ viewId }, { put }) {
      console.log('hhhhh:');
      yield put({ type: 'deleteLayout', viewId });
      yield put({ type: 'biEditor/deleteEditorInfo', viewId });
      // yield put({ type: 'linkSetting/deleteLinkMap', linkId: viewId });
    },
    // * resetBoard(_, { put }) {
    //   yield put({ type: 'reset' });
    //   yield put({ type: 'biEditor/reset' });
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

const getNewChartYPostion = (layout) => {
  const { y: maxY, h: maxH } = maxBy(layout, ({ y, h }) => y + h) || { y: 0, h: 0 };
  return maxY + maxH;
};

