import React from 'react';
import ReactEcharts, { ReactEchartsPropsTypes } from 'echarts-for-react';
import sizeMe from 'react-sizeme';
import styles from './index.scss';

interface IProps extends ReactEchartsPropsTypes {
  size: { width: number, height: number }
}
const Chart = ({ size, ...props }: IProps) => (
  <div className={styles.sizeme}>
    <ReactEcharts {...props} style={{ ...props.style, height: size.height }} />
  </div>
);

export default sizeMe({ monitorHeight: true })(Chart);
