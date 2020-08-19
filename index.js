import { convertOptionToSetting, convertSettingToOption } from './src/components/charts/utils';

import BoardGrid from './src/grid';
import DataSettingsCommonCharts from './src/components/charts/data-settings';
import DataSettingsCommonControls from './src/components/controls/data-settings';

export * from './src/config';
export { colorMap as diceColorMap } from './src/theme/dice';

export {
  BoardGrid,
  DataSettingsCommonCharts,
  DataSettingsCommonControls,
  convertSettingToOption,
  convertOptionToSetting,
};
