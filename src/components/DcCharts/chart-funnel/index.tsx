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

const ChartFunnel = React.forwardRef((props: IProps, ref: React.Ref<any>) => (
  <ChartSizeMe {...props} option={getOption(props.data, props.config)} ref={ref} />
));

export default ChartFunnel;
