import { maxBy, remove, get } from 'lodash';
import agent from 'agent';

export function getChartData(url) {
  return agent.get(url)
    .then(response => response.body);
}

export default {
  namespace: 'biDashBoard',
  state: {
    isEdit: false,
    layout: [],
    dashboardType: '', // 布局类型
  },
  effects: {
    * initDashboard({ dashboardType, extra }, { put }) {
      yield put({ type: 'querySuccess', payload: { layout: get(extra, 'layout', []), dashboardType } });
      yield put({ type: 'biDrawer/init', drawerInfoMap: get(extra, 'drawerInfoMap', {}) });
    },
    * generateChart({ chartId }, { select, put }) {
      const {
        biDashBoard: { layout },
        biDrawer: { drawerInfo },
      } = yield select(state => state);
      layout.push({ i: chartId, x: 0, y: getNewChartYPostion(layout), w: 4, h: 6 });
      yield put({ type: 'querySuccess', payload: { layout } });
      yield put({ type: 'biDrawer/updateDrawerInfoMap', drawerInfo: { chartType: drawerInfo.chartType }, editChartId: chartId });
    },
    * saveEdit(_, { put, select }) {
      yield put({ type: 'querySuccess', payload: { isEdit: false } });
      const { biDashBoard: { layout }, biDrawer: { drawerInfoMap } } = yield select(state => state);
      // @todo  drawerInfoMap过滤和layout没有交集的地方
      return { layout, drawerInfoMap }; // 只输出外部需要的
    },
    * deleteChart({ chartId }, { select, put }) {
      const { layout } = yield select(state => state.biDashBoard);
      remove(layout, ({ i }) => chartId === i);
      yield put({ type: 'querySuccess', payload: { layout: [...layout] } });
      yield put({ type: 'biDrawer/deleteDrawerInfo', chartId });
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
  },
};

const getNewChartYPostion = (layout) => {
  const { y: maxY, h: maxH } = maxBy(layout, ({ y, h }) => y + h) || { y: 0, h: 0 };
  return maxY + maxH;
};

