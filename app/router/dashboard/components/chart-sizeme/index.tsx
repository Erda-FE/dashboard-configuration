import React from 'react';
import { isEqual } from 'lodash';
import ReactEcharts, { ReactEchartsPropsTypes } from 'echarts-for-react';
import sizeMe from 'react-sizeme';
import { ISizeMe } from 'dashboard/types';
import './index.scss';

type IProps = ReactEchartsPropsTypes & ISizeMe & {
  descHeight: number // 图表应减少的高度
  isMock?: boolean
};

class Chart extends React.Component<IProps> {
  static defaultProps = {
    descHeight: 32,
  };

  shouldComponentUpdate(nextProps: IProps) {
    return !isEqual(nextProps, this.props);
  }

  render() {
    const { size, descHeight, isMock, ...others } = this.props;
    return (
      <div className="bi-chart-sizeme">
        {isMock && (
          <div className="bi-chart-mask">
            <div className="bi-mask-inner" />
            <div className="bi-mask-text">模拟数据展示</div>
          </div>
        )}
        <ReactEcharts {...others} style={{ ...others.style, height: size.height - descHeight }} />
      </div>
    );
  }
}

export default sizeMe({ monitorHeight: true })(Chart);
