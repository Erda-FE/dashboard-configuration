import { map } from 'lodash';
import moment from 'moment';
import { TextType } from 'src/stores/dash-board';

const getBeforeTimeRange = (number: number, string: any) => [moment().subtract(number, string).valueOf(), moment().valueOf()];
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

export const customTimeRangeMap = (textMap: TextType) => ({
  '5min': {
    name: textMap['5min'],
    getTimeRange: () => getBeforeTimeRange(5, 'minutes'),
  },
  '30min': {
    name: textMap['30min'],
    getTimeRange: () => getBeforeTimeRange(30, 'minutes'),
  },
  '1hour': {
    name: textMap['1hour'],
    getTimeRange: () => getBeforeTimeRange(1, 'hours'),
  },
  '3hour': {
    name: textMap['3hour'],
    getTimeRange: () => getBeforeTimeRange(3, 'hours'),
  },
  today: {
    name: textMap.today,
    getTimeRange: () => getScopeTimeRange('day'),
  },
  yesterday: {
    name: textMap.yesterday,
    getTimeRange: () => getLastScopeTimeRange('day'),
  },
  'this-week': {
    name: textMap['this week'],
    getTimeRange: () => getScopeTimeRange('week'),
  },
  'last-week': {
    name: textMap['last week'],
    getTimeRange: () => getLastScopeTimeRange('week'),
  },
  'this-month': {
    name: textMap['this month'],
    getTimeRange: () => getScopeTimeRange('month'),
  },
  'last-month': {
    name: textMap['last month'],
    getTimeRange: () => getLastScopeTimeRange('month'),
  },
  'this-year': {
    name: textMap['this year'],
    getTimeRange: () => getScopeTimeRange('year'),
  },
  'last-year': {
    name: textMap['last year'],
    getTimeRange: () => getLastScopeTimeRange('year'),
  },
});

export const TIME_FORMATS = [
  {
    label: 'YYYY/MM',
    value: 'YYYY/MM',
  },
  {
    label: 'YYYY/MM/DD',
    value: 'YYYY/MM/DD',
  },
  {
    label: 'YYYY',
    value: 'YYYY',
  },
  {
    label: 'MMM',
    value: 'MMM',
  },
  {
    label: 'M/D HH:mm',
    value: 'M/D HH:mm',
  },
  {
    label: 'HH:mm',
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

// eslint-disable-next-line no-shadow
export enum SPECIAL_METRIC_TYPE {
  time = 'time',
  expr = 'expr',
  field = 'field',
  filter = 'filter',
  sort = 'sort',
}

// 特殊指标值，唯一标志
export const SPECIAL_METRIC = {
  [SPECIAL_METRIC_TYPE.time]: 'c_dimensions-time',
  [SPECIAL_METRIC_TYPE.expr]: 'c_metric-expr',
  [SPECIAL_METRIC_TYPE.field]: 'c_data-field',
  [SPECIAL_METRIC_TYPE.filter]: 'c_data-filter',
  [SPECIAL_METRIC_TYPE.sort]: 'c_data-sort',
};

interface DimensionConfig {
  actionKey?: DICE_DATA_CONFIGURATOR.DimensionConfigsActionType;
  label?: string;
  info?: string;
  type?: 'divider' | 'sub';
  key?: string;
  options?: Array<{ value: string; label: string }>;
}

// eslint-disable-next-line no-shadow
enum SORT_TYPE {
  desc = 'DESC',
  asc = 'ASC'
}

export const sortMap = (textMap: TextType) => ({
  [SORT_TYPE.desc]: { value: SORT_TYPE.desc, label: textMap.desc },
  [SORT_TYPE.asc]: { value: SORT_TYPE.asc, label: textMap.asc },
});


export const dimensionsConfigs = (textMap: TextType) => ({
  [SPECIAL_METRIC_TYPE.expr]: [
    {
      key: SPECIAL_METRIC_TYPE.expr,
      label: textMap['expr input'],
      info: textMap['required item'],
      actionKey: 'configExpr',
    },
  ],
  [SPECIAL_METRIC_TYPE.time]: [
    {
      key: SPECIAL_METRIC_TYPE.time,
      label: textMap['time config'],
      actionKey: 'configTime',
    },
  ],
  [SPECIAL_METRIC_TYPE.field]: [
  ],
  [SPECIAL_METRIC_TYPE.sort]: [
    {
      key: SPECIAL_METRIC_TYPE.sort,
      label: textMap['sort method'],
      type: 'sub',
      options: map(sortMap, (item) => item),
    },
  ],
});

// eslint-disable-next-line no-shadow
export enum UNIT_TYPE {
  NUMBER = 'NUMBER',
  PERCENT = 'PERCENT',
  CAPACITY = 'CAPACITY',
  TRAFFIC = 'TRAFFIC',
  TIME = 'TIME',
  CUSTOM = 'CUSTOM',
}

export const unitInfMap = (textMap: TextType) => ({
  [UNIT_TYPE.NUMBER]: {
    name: textMap['number conversion'],
    value: UNIT_TYPE.NUMBER,
    units: ['', 'K', 'M'],
    defaultUnit: '',
  },
  [UNIT_TYPE.PERCENT]: {
    name: textMap.percent,
    value: UNIT_TYPE.PERCENT,
    defaultUnit: '%',
  },
  [UNIT_TYPE.CAPACITY]: {
    name: textMap['capacity unit'],
    value: UNIT_TYPE.CAPACITY,
    units: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    defaultUnit: 'B',
  },
  [UNIT_TYPE.TRAFFIC]: {
    name: textMap['traffic unit'],
    value: UNIT_TYPE.TRAFFIC,
    units: ['B/S', 'KB/S', 'MB/S', 'GB/S', 'TB/S', 'PB/S', 'EB/S', 'ZB/S', 'YB/S'],
    defaultUnit: 'B/S',
  },
  [UNIT_TYPE.TIME]: {
    name: textMap['time unit'],
    value: UNIT_TYPE.TIME,
    units: ['ns', 'μs', 'ms', 's'],
    defaultUnit: 'ms',
  },
  [UNIT_TYPE.CUSTOM]: {
    name: textMap.custom,
    value: UNIT_TYPE.CUSTOM,
    defaultUnit: '',
  },
});

export const timeIntervals = (textMap: TextType) => ([
  {
    label: textMap.second,
    value: 's',
  },
  {
    label: textMap.minute,
    value: 'm',
  },
  {
    label: textMap.hour,
    value: 'h',
  },
  {
    label: textMap.day,
    value: 'd',
  },
  {
    label: textMap.week,
    value: 'W',
  },
  // {
  //   label: textMap.month,
  //   value: 'M',
  // },
]);

export const TIME_FIELDS_UNITS = [
  { label: 'ns', value: 'ns' },
  { label: 'µs', value: 'µs' },
  { label: 'ms', value: 'ms' },
  { label: 's', value: 's' },
  { label: 'm', value: 'm' },
  { label: 'h', value: 'h' },
  { label: 'day', value: 'day' },
];

// eslint-disable-next-line no-shadow
export enum SQL_KEY_WORD {
  select = 'select',
  from = 'from',
  where = 'where',
  groupBy = 'groupBy',
  orderBy = 'orderBy',
  limit = 'limit',
}

export const SQL_OPERATOR = {
  [SQL_KEY_WORD.select]: 'SELECT',
  [SQL_KEY_WORD.from]: 'FROM',
  [SQL_KEY_WORD.where]: 'WHERE',
  [SQL_KEY_WORD.groupBy]: 'GROUP BY',
  [SQL_KEY_WORD.orderBy]: 'ORDER BY',
  [SQL_KEY_WORD.limit]: 'LIMIT',
};
