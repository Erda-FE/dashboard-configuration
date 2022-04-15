import generateCharts from 'src/components/DcCharts/common/gen-charts';
import { getOption } from './option';

/**
 * @description 2D pie chart
 */
const ChartPie = generateCharts(getOption);
ChartPie.displayName = 'ChartPie';
export default ChartPie;
