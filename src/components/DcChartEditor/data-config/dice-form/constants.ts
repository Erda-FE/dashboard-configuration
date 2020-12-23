import moment from 'moment';
import DashboardStore from '../../../../stores/dash-board';

const textMap = DashboardStore.getState((s) => s.textMap);
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

export enum SPECIAL_METRIC_TYPE {
  time = 'time',
  expr = 'expr',
  field = 'field',
  filter = 'filter',
}

// 特殊指标值，唯一标志
export const SPECIAL_METRIC = {
  [SPECIAL_METRIC_TYPE.time]: 'c_dimensions-time',
  [SPECIAL_METRIC_TYPE.expr]: 'c_metric-expr',
  [SPECIAL_METRIC_TYPE.field]: 'c_data-field',
  [SPECIAL_METRIC_TYPE.filter]: 'c_data-filter',
};

interface DimensionConfig {
  actionKey?: DICE_DATA_CONFIGURATOR.DimensionConfigsActionType;
  label?: string;
  info?: string;
  type?: 'divider' | 'sub';
  key?: string;
  options?: Array<{ value: string; label: string }>;
}

export const COMMON_DIMENSIONS_CONFIGS: DimensionConfig[] = [
  {
    key: 'alias',
    label: textMap['field config'],
    actionKey: 'configAlias',
  },
];

export const DIMENSIONS_CONFIGS: Record<SPECIAL_METRIC_TYPE, DimensionConfig[]> = {
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
};

export const TIME_INTERVALS = [
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
  {
    label: textMap.month,
    value: 'M',
  },
];
