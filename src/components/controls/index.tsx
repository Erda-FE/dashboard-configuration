import { IChartsMap } from '../../types';
// 控件
import SelectNormal from './select-normal';
// 数据配置项
import DataSettingsCommon from './data-settings';
import DataSettingsSelectNormal from './select-normal/data-settings';

const defaultControlsMap: IChartsMap = {
  selectNormal: {
    name: '常规下拉框',
    icon: '常规下拉框',
    component: SelectNormal,
    dataSettings: [DataSettingsCommon, DataSettingsSelectNormal],
  }
};

export default defaultControlsMap;