import { getLocale, setLocale, getTheme, setTheme } from './stores/dash-board';
import BoardGrid from './components/DcBoard';
import PureBoardGrid from './components/DcBoard/pure-grid';

export * from './config';
export { createLoadDataFn } from './components/DcChartEditor/data-config/dice-form/data-loader';
export { colorMap as diceColorMap } from './theme/dice';
export { getLocale, setLocale, getTheme, setTheme };
export { PureBoardGrid, BoardGrid };
