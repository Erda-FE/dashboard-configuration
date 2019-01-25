import React from 'react';
import { isEqual } from 'lodash';
import ReactEcharts, { Func, ReactEchartsPropsTypes } from 'echarts-for-react';
import sizeMe from 'react-sizeme';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { ISizeMe } from '../../../types';
import ChartMask from '../chart-mask';
import './index.scss';

type IProps = ReactEchartsPropsTypes & ISizeMe & ReturnType<typeof mapDispatchToProps> & {
  chartId: string
  descHeight: number // 图表应减少的高度
  isMock?: boolean
};

// 重写相关生命周期，用于注册theme
const oldComponentDidMount = ReactEcharts.prototype.componentDidMount as Func;
const oldComponentDidUpdate = ReactEcharts.prototype.componentDidUpdate as Func;

ReactEcharts.prototype.componentDidMount = function (...arg) {
  const { theme, themeObj } = this.props;
  this.echartsLib.registerTheme(theme, themeObj);
  oldComponentDidMount.call(this, ...arg);
};

ReactEcharts.prototype.componentDidUpdate = function (...arg) {
  const { theme, themeObj } = this.props;
  this.echartsLib.registerTheme(theme, themeObj);
  oldComponentDidUpdate.call(this, ...arg);
};

class Chart extends React.Component<IProps> {
  static defaultProps = {
    descHeight: 32,
    notMerge: true, // 因v4.2.0-rc在切换图形类型或者更新数据更新存在bug,所以必须设置为true
  };

  static contextTypes = {
    theme: PropTypes.string,
    themeObj: PropTypes.object,
  };

  private onEvents: { [event: string]: Func };

  componentWillMount() {
    this.onEvents = {
      click: this.click,
    };
  }

  shouldComponentUpdate(nextProps: IProps) {
    return !isEqual(nextProps, this.props);
  }

  click = ({ name }: any) => {
    this.props.updateLinkDataMap(this.props.chartId, { name });
  }

  render() {
    const { size, descHeight, isMock, ...others } = this.props;
    const { theme, themeObj } = this.context;
    return (
      <div className="bi-chart-sizeme">
        <ReactEcharts
          {...others}
          theme={theme}
          themeObj={themeObj}
          style={{ ...others.style, height: size.height - descHeight }}
          onEvents={this.onEvents}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  updateLinkDataMap(linkId: string, values: object) {
    dispatch({ type: 'linkSetting/updateLinkDataMap', linkId, values });
  },
});

export default sizeMe({ monitorHeight: true })(connect(undefined, mapDispatchToProps)(Chart));
