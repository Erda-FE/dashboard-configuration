import generateCharts from 'src/components/DcCharts/common/gen-charts';
import { getOption } from './option';

/**
 * @description funnel Chart
 */
const ChartFunnel = generateCharts(getOption);
ChartFunnel.displayName = 'ChartFunnel';
export default ChartFunnel;
