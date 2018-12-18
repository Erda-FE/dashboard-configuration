import React from 'react';
import ReactEcharts, { ReactEchartsPropsTypes } from 'echarts-for-react';
import sizeMe from 'react-sizeme';
import { ISizeMe } from 'dashboard/types';
import styles from './index.scss';

type IProps = ReactEchartsPropsTypes & ISizeMe;

const Chart = ({ size, ...props }: IProps) => (
  <div className={styles.sizeme}>
    <ReactEcharts {...props} style={{ ...props.style, height: size.height }} />
  </div>
);

export default sizeMe({ monitorHeight: true })(Chart);
