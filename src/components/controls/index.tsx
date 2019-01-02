import { IChartsMap } from '../../types';
// 控件
import SelectNormal from './select-normal';
// 数据配置项
import DataSettingsSelectNormal from './select-normal/data-settings';

const defaultControlsMap: IChartsMap = {
  select: {
    name: '常规下拉框',
    icon: '常规下拉框',
    component: SelectNormal,
    dataSettings: [DataSettingsSelectNormal],
  }
};

export default defaultControlsMap;