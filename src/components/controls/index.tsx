import { IChartsMap } from '../../types';
// 控件
import SelectNormal from './select-normal';
import SelectDateTime from './select-date-time';
import SelectDateRange from './select-date-range';
// 数据配置项
import DataSettingsCommon from './data-settings';
import DataSettingsSelectNormal from './select-normal/data-settings';

const defaultControlsMap: IChartsMap = {
  selectNormal: {
    name: '常规下拉框',
    icon: '常规下拉框',
    component: SelectNormal,
    dataSettings: [DataSettingsCommon, DataSettingsSelectNormal],
  },
  selectDatetime: {
    name: '时间下拉框',
    icon: '时间下拉框',
    component: SelectDateTime,
    dataSettings: [DataSettingsCommon],
  },
  selectDateRange: {
    name: '时间范围下拉框',
    icon: '时间范围下拉框',
    component: SelectDateRange,
    dataSettings: [DataSettingsCommon],
  },
};

export default defaultControlsMap;
