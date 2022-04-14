import * as React from 'react';
import { ReactEchartsPropsTypes } from 'echarts-for-react';
import { ChartSizeMe } from 'src/components/DcCharts/common/index';
import { IProps } from 'src/components/DcCharts/common/chart-sizeme';

type GetOption = (data: DC.StaticData, config: DC.ChartConfig) => ReactEchartsPropsTypes['option'] | any;

const generateCharts = <T extends IProps = IProps>(getOption: GetOption) =>
  React.forwardRef<any, T>((props, ref) => (
    <ChartSizeMe {...props} option={getOption(props.data, props.config)} ref={ref} />
  ));

export default generateCharts;
