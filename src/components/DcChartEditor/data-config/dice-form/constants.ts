import moment from 'moment';

const getScopeTimeRange = (scope: any) => [moment().startOf(scope).valueOf(), moment().valueOf()];
const getLastScopeTimeRange = (scope: any) => [moment()[scope](moment()[scope]() - 1).startOf(scope).valueOf(), moment()[scope](moment()[scope]() - 1).endOf(scope).valueOf()];

interface IPagination {
  pageSize: number;
  pageSizeOptions: string[];
}

export const PAGINATION: IPagination = {
  pageSize: 15,
  pageSizeOptions: ['15', '30', '45', '60'],
};

export const CUSTOM_TIME_RANGE_MAP = {
  today: {
    name: '今天',
    getTimeRange: () => getScopeTimeRange('day'),
  },
  yesterday: {
    name: '昨天',
    getTimeRange: () => getLastScopeTimeRange('day'),
  },
  'this-week': {
    name: '本周',
    getTimeRange: () => getScopeTimeRange('week'),
  },
  'last-week': {
    name: '上周',
    getTimeRange: () => getLastScopeTimeRange('week'),
  },
  'this-month': {
    name: '本月',
    getTimeRange: () => getScopeTimeRange('month'),
  },
  'last-month': {
    name: '上月',
    getTimeRange: () => getLastScopeTimeRange('month'),
  },
  'this-year': {
    name: '今年',
    getTimeRange: () => getScopeTimeRange('year'),
  },
  'last-year': {
    name: '去年',
    getTimeRange: () => getLastScopeTimeRange('year'),
  },
};

export const TIME_FORMATS = [
  {
    name: '年/月',
    value: 'YYYY/MM',
  },
  {
    name: '年/月/日',
    value: 'YYYY/MM/DD',
  },
  {
    name: '年',
    value: 'YYYY',
  },
  {
    name: '月',
    value: 'MMM',
  },
  {
    name: '月/日 时:分',
    value: 'M/D HH:mm',
  },
  {
    name: '时:分',
    value: 'HH:mm',
  },
];

export const MAP_LEVEL = ['province', 'city', 'district'];

// 地图固定的指标别名
export const MAP_ALIAS = 'map_name';
// 指标前缀名
export const METRIC_UID_PREFIX = 'mid';
/**
 *特殊指标类型名
 *
 * @export
 * @enum {number}
 */
export enum SPECIAL_METRIC_TYPE {
  time = 'time',
  expr = 'expr',
  field = 'field',
}
// 特殊指标值，唯一标志
export const SPECIAL_METRIC = {
  [`${SPECIAL_METRIC_TYPE.time}`]: 'c_dimensions-time',
  [`${SPECIAL_METRIC_TYPE.expr}`]: 'c_metric-expr',
  [`${SPECIAL_METRIC_TYPE.field}`]: 'c_data-field'
}

