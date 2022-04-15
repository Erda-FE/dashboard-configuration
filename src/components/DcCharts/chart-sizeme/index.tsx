import React from 'react';
import DashboardStore from 'src/stores/dash-board';
import ReactEchartsEnhance from 'src/components/DcCharts/react-echarts-enhance';

interface IProps {
  viewId?: string;
  data: object;
  config: {
    option: object;
  };
  style?: object;
  theme?: string;
  option: any;

  [k: string]: any;
}

export default ({ style, option, ...rest }: IProps) => {
  const theme = DashboardStore.useStore((s) => s.theme);

  return <ReactEchartsEnhance {...rest} notMerge option={option} theme={theme} style={{ ...style, height: '100%' }} />;
};
