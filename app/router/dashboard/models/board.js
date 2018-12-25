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
    drawerInfoMap: {}, // 所有图表配置信息
  },
  effects: {
    * generateChart({ chartId }, { select, put }) {
      const {
        biDashBoard: { layout, drawerInfoMap },
        biDrawer: { drawerInfo },
      } = yield select(state => state);
      layout.push({ i: chartId, x: 0, y: getNewChartYPostion(layout), w: 4, h: 6 });
      yield put({ type: 'querySuccess',
        payload: {
          drawerInfoMap: { ...drawerInfoMap, [chartId]: { chartType: drawerInfo.chartType } },
          layout,
        },
      });
    },
    * saveEdit(_, { put, select }) {
      yield put({ type: 'querySuccess', payload: { isEdit: false } });
      const { layout, drawerInfoMap } = yield select(state => state.biDashBoard);
      return { layout, drawerInfoMap }; // 只输出外部需要的
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, ...payload };
    },
    deleteChart(state, { chartId }) {
      const { layout, drawerInfoMap } = state;
      remove(layout, ({ i }) => chartId === i);
      delete drawerInfoMap[chartId];
      return { ...state, drawerInfoMap: { ...drawerInfoMap }, layout };
    },
    updateDrawerInfoMap(state, { drawerInfo, editChartId }) {
      const { drawerInfoMap } = state;
      return { ...state, drawerInfoMap: { ...drawerInfoMap, [editChartId]: drawerInfo } };
    },
    onLayoutChange(state, { layout }) {
      return { ...state, layout };
    },
    initDashboard(state, { dashboardType, extra }) {
      return {
        ...state,
        dashboardType,
        layout: get(extra, 'layout', []),
        drawerInfoMap: get(extra, 'drawerInfoMap', {}),
      };
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

