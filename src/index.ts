import { getLocale, setLocale, getTheme, setTheme } from './stores/dash-board';
import BoardGrid from './components/DcBoard';
import PureBoardGrid from './components/DcBoard/pure-board';

export * from './config';
export { createLoadDataFn } from './components/DcChartEditor/data-config/dice-form/data-loader';
export { createLoadDataFn as createOldLoadDataFn } from './components/DcChartEditor/data-config/dice-form/old-data-loader';
export { colorMap } from './theme/dice';
export { getLocale, setLocale, getTheme, setTheme };
export { PureBoardGrid, BoardGrid };
