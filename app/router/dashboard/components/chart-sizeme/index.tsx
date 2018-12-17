import React from 'react';
import ReactEcharts, { ReactEchartsPropsTypes } from 'echarts-for-react';
import sizeMe from 'react-sizeme';

interface IProps extends ReactEchartsPropsTypes {
  size: { width: number, height: number }
}
const Chart = ({ size, ...props }: IProps) => <ReactEcharts {...props} style={{ ...props.style, height: size.height }} />;

export default sizeMe({ monitorHeight: true })(Chart);
