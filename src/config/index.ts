import { set, get } from 'lodash';
import defaultChartsMap from '../components/views';
import { theme, themeObj as defaultTheme } from '../theme/dice';

const globalConfig = {
  chartConfigMap: defaultChartsMap,
  chartOption: {},
  chartOptionFn: {},
  dataConvertor: {},
  ControlMap: {},
  theme: {
    [theme]: defaultTheme,
  },
};

const regist = (path: string | string[] | number | number[], data: any) => {
  set(globalConfig, path, data);
};

export const getConfig = (path: string | string[] | number | number[]) => get(globalConfig, path);

/**
 * 注册单个图表
 * @param name 名称
 * @param {function} 图表配置对象
 * 包括name, icon, Component, Configurator
 * @returns 已注册所有图表
 */
export const registChart = (type: string, data: any) => {
  regist(`chartConfigMap.${type}`, data);
  return getConfig('chartConfigMap');
};

/**
 * 批量注册图表
 * @param chartMap对象，以key为名称注册
 * @returns 已注册所有图表
 */
export const registCharts = (viewMap = {}) => {
  Object.keys(viewMap).forEach((k) => {
    regist(`chartConfigMap.${k}`, viewMap[k]);
  });
  return getConfig('chartConfigMap');
};

/**
 * 注册图表配置
 * @param name 名称
 * @param {object} 图表配置对象
 * @returns 已注册所有图表配置
 * @see https://echarts.baidu.com/option.html
 */
export const registChartOption = (name: string, data: any) => {
  regist(`chartOption.${name}`, data);
  return getConfig('chartOption');
};

/**
 * 注册图表配置方法
 * @param name 名称
 * @param {function} 图表配置方法，参数为data
 * @returns 已注册所有图表配置方法
 */
export const registChartOptionFn = (name: string, fn: Function) => {
  regist(`chartOptionFn.${name}`, fn);
  return getConfig('chartOptionFn');
};

/**
 * 注册数据转换器
 * @param name 名称
 * @param {function} fn 以数据对象为唯一参数，转换loadData返回数据，返回格式需符合对应视图格式
 * @returns 已注册所有数据转换器
 */
export const registDataConvertor = (name: string, fn: Function) => {
  regist(`dataConvertor.${name}`, fn);
  return getConfig('dataConvertor');
};

/**
 * 注册控件
 * @param name 控件名称
 * @param themeObj 控件组件
 * @property {string}  viewId
 * @property {string}  query: 当前视图所有控件数据
 * @property {function}  onChange: 传递控件数据给视图
 * @property {function}  loadData: 控件触发重新加载数据，会携带query为参数
 * @returns 已注册所有控件
 */
export const registControl = (name: string, Comp: any) => {
  regist(`ControlMap.${name}`, Comp);
  return getConfig('ControlMap');
};

/**
 * 注册主题
 * @param name 主题名称
 * @param themeObj 主题配置对象，可用EChart官网工具生成
 * @see https://echarts.baidu.com/theme-builder/
 * @returns 已注册所有主题
 */
export const registTheme = (name: string, themeObj: object) => {
  regist(`theme.${name}`, themeObj);
  return getConfig('theme');
};
