/**
 * 2D 饼图
 */
import { ChartSizeMe } from 'src/components/DcCharts/common';
import * as React from 'react';
import { getOption } from './option';

interface IProps {
  data: any;
  viewId: string;
  config: {
    option: object;
  };
}

// TODO: 几个图都一样，可以合并一下
const ChartPie = React.forwardRef((props: IProps, ref: React.Ref<any>) => (
  <ChartSizeMe {...props} option={getOption(props.data, props.config)} ref={ref} />
));

export default ChartPie;
