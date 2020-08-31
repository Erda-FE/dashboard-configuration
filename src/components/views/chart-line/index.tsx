/**
 * 2D 线形图：折线、柱状、曲线
 */
import ChartSizeMe from '../chart-sizeme';
import * as React from 'react';
import { getOption } from './option';

interface IProps {
  data: any
  viewId: string
  config: {
    option: object
  }
}

const ChartLine = React.forwardRef((props: IProps, ref: React.Ref<any>) => (
  <ChartSizeMe {...props} getOption={getOption} ref={ref} />
));

export default ChartLine;
