import React from 'react';
import ReactEcharts, { ReactEchartsPropsTypes } from 'echarts-for-react';
import sizeMe from 'react-sizeme';
import { ISizeMe } from 'dashboard/types';
import './index.scss';

type IProps = ReactEchartsPropsTypes & ISizeMe & {
  descHeight?: number // 图表应减少的高度
};

const Chart = ({ size, descHeight = 32, ...props }: IProps) => (
  <div className="chart-sizeme">
    <ReactEcharts {...props} style={{ ...props.style, height: size.height - descHeight }} />
  </div>
);

export default sizeMe({ monitorHeight: true })(Chart);
