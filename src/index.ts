import { getLocale, getTheme, setLocale, setTheme } from 'src/stores/dash-board';
import BoardGrid from 'src/components/DcBoard';
import PureBoardGrid from 'src/components/DcBoard/pure-board';

export * from 'src/config';
export { default as dcRegisterComp } from 'src/components/dc-register-comp';
export { createLoadDataFn } from 'src/components/DcChartEditor/data-config/dice-form/data-loader';
export { createLoadDataFn as createOldLoadDataFn } from 'src/components/DcChartEditor/data-config/dice-form/old-data-loader';
export { colorMap } from 'src/theme/dice';
export { getLocale, setLocale, getTheme, setTheme };
export { PureBoardGrid, BoardGrid };
