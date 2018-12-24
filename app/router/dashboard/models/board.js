import { maxBy, remove, get } from 'lodash';
import agent from 'agent';
import { message } from 'antd';

export function getChartData(url) {
  return agent.get(url)
    .then(response => response.body);
}

export default {
  namespace: 'biDashBoard',
  state: {
    isEdit: false,
    layout: [],
    chartDatasMap: {}, // 图表基本数据信息
    dashboardType: '', // 布局类型
    drawerInfoMap: {}, // 所有图表配置信息
  },
  effects: {
    * generateChart({ chartId }, { call, select, put }) {
      const {
        biDashBoard: { chartDatasMap, layout, drawerInfoMap },
        biDrawer: { drawerInfo },
      } = yield select(state => state);
      const url = get(drawerInfo, ['panneldata#url']);
      let chartData = { isMock: true };
      try {
        if (url) chartData = { ...chartData, ...(yield call(getChartData, url)), isMock: false };
      } catch (error) {
        message.error('该图表接口获取数据失败,将使用mock数据显示', 3);
      }
      chartDatasMap[chartId] = chartData;
      layout.push({ i: chartId, x: 0, y: getNewChartYPostion(layout), w: 4, h: 6 });
      yield put({ type: 'querySuccess',
        payload: {
          drawerInfoMap: { ...drawerInfoMap, [chartId]: { chartType: drawerInfo.chartType } },
          chartDatasMap: { ...chartDatasMap },
          layout,
        },
      });
    },
    * saveEdit(_, { put, select }) {
      yield put({ type: 'querySuccess', payload: { isEdit: false } });
      const { layout, chartDatasMap, drawerInfoMap } = yield select(state => state.biDashBoard);
      return { layout, chartDatasMap, drawerInfoMap }; // 只输出外部需要的
    },
    * reloadChart({ chartId }, { put, select, call }) { // 刷新图表
      const { chartDatasMap, drawerInfoMap } = yield select(state => state.biDashBoard);
      try {
        const url = get(drawerInfoMap, [chartId, 'panneldata#url']);
        let chartData = chartDatasMap[chartId];
        if (url) chartData = { ...chartData, ...(yield call(getChartData, url)), isMock: false };
        yield put({ type: 'querySuccess', payload: { chartDatasMap: { ...chartDatasMap, [chartId]: chartData } } });
      } catch (error) {
        message.error('该图表接口获取数据失败,将使用mock数据显示', 3);
      }
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, ...payload };
    },
    deleteChart(state, { chartId }) {
      const { chartDatasMap, layout, drawerInfoMap } = state;
      remove(layout, ({ i }) => chartId === i);
      delete chartDatasMap[chartId];
      delete drawerInfoMap[chartId];
      return { ...state, chartDatasMap: { ...chartDatasMap }, layout };
    },
    updateDrawerInfoMap(state, { drawerInfo, editChartId }) {
      const { drawerInfoMap, chartDatasMap } = state;
      return { ...state, chartDatasMap, drawerInfoMap: { ...drawerInfoMap, [editChartId]: drawerInfo } };
    },
    onLayoutChange(state, { layout }) {
      return { ...state, layout };
    },
    initDashboard(state, { dashboardType, extra }) {
      return {
        ...state,
        dashboardType,
        layout: get(extra, 'layout', []),
        chartDatasMap: get(extra, 'chartDatasMap', {}),
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

