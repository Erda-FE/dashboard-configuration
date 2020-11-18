import { getLocale, setLocale, getTheme, setTheme } from './stores/dash-board';
import BoardGrid from './components/DcGrid';
import PureBoardGrid from './components/DcGrid/pure-grid';

export * from './config';
export { colorMap as diceColorMap } from './theme/dice';
export { getLocale, setLocale, getTheme, setTheme };
export { PureBoardGrid, BoardGrid };
