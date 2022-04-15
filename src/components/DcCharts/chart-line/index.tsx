import generateCharts from 'src/components/DcCharts/common/gen-charts';
import { getOption } from './option';

/**
 * @description 2D Line chart: broken line, bar chart, curve chart
 */
const ChartLine = generateCharts(getOption);
ChartLine.displayName = 'ChartLine';
export default ChartLine;
