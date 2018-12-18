import React from 'react';
import { isEqual } from 'lodash';
import ReactEcharts, { ReactEchartsPropsTypes } from 'echarts-for-react';
import sizeMe from 'react-sizeme';
import { ISizeMe } from 'dashboard/types';
import './index.scss';

type IProps = ReactEchartsPropsTypes & ISizeMe & {
  descHeight: number // 图表应减少的高度
};

// @fix: 保存编辑的切换时图表仍会再次刷新，原因不明
class Chart extends React.Component<IProps> {
  static defaultProps = {
    descHeight: 32,
  };

  shouldComponentUpdate(nextProps: IProps) {
    return !isEqual(nextProps, this.props);
  }

  render() {
    const { size, descHeight, ...others } = this.props;
    return (
      <div className="chart-sizeme">
        <ReactEcharts {...others} style={{ ...others.style, height: size.height - descHeight }} />
      </div>
    );
  }
}

export default sizeMe({ monitorHeight: true })(Chart);
