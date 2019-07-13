import { set, get } from 'lodash';
import defaultChartsMap from '../components/charts';
import { EditorContainer } from './editor-container';

const globalConfig = {
  chartsMap: defaultChartsMap,
  EditorContainer,
  dataConvertor: {},
  ControlMap: {},
};

const regist = (path: string | string[] | number | number[], data: any) => {
  set(globalConfig, path, data);
};

export const getConfig = (path: string | string[] | number | number[]) => {
  return get(globalConfig, path);
};

export const registChart = (type: string, data: any) => {
  regist(`chartsMap.${type}`, data);
  return getConfig('chartsMap');
};

export const registCharts = (chartMap = {}) => {
  Object.keys(chartMap).forEach((k) => {
    regist(`chartsMap.${k}`, chartMap[k]);
  });
  return getConfig('chartsMap');
};

export const registDataConvertor = (name: string, fn: Function) => {
  regist(`dataConvertor.${name}`, fn);
  return getConfig('dataConvertor');
};

export const registControl = (name: string, Comp: any) => {
  regist(`ControlMap.${name}`, Comp);
  return getConfig('ControlMap');
};
