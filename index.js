import { convertOptionToSetting, convertSettingToOption } from './src/components/charts/utils';

import BoardGrid from './src/board-grid';
import DataSettingsCommonCharts from './src/components/charts/data-settings';
import DataSettingsCommonControls from './src/components/controls/data-settings';
import biModels from './src/models';
import {
  getConfig,
  registChart,
  registCharts,
  registChartOption,
  registDataConvertor,
  registControl,
  registTheme,
} from './src/config';

export {
  BoardGrid,
  biModels,
  DataSettingsCommonCharts,
  DataSettingsCommonControls,
  convertSettingToOption,
  convertOptionToSetting,
  getConfig,
  registChart,
  registCharts,
  registChartOption,
  registDataConvertor,
  registControl,
  registTheme,
};
