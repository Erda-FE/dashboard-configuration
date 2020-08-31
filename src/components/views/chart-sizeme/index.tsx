import ReactEcharts, { Func } from 'echarts-for-react';
import { isEqual } from 'lodash';
import React from 'react';
import DashboardStore from '../../../stores/dash-board';

interface IProps {
  viewId: string
  data: object
  config: {
    option: object
  }
  style?: object
  contextMap: any
  getOption(data: object, customOption: object): object
}

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
    notMerge: true, // 因v4.2.0-rc在切换图形类型或者更新数据更新存在bug,所以必须设置为true
  };

  shouldComponentUpdate(nextProps: IProps) {
    return !isEqual(nextProps, this.props);
  }

  render() {
    const { data, config = {}, getOption, style, contextMap, ...others } = this.props;
    const { theme, themeObj } = contextMap;
    return (
      <ReactEcharts
        {...others}
        option={getOption(data, config)}
        theme={theme}
        themeObj={themeObj}
        style={{ ...style, height: '100%' }}
      />
    );
  }
}

export default (p: any) => {
  const contextMap = DashboardStore.useStore(s => s.contextMap);
  const storeProps = {
    contextMap,
  };
  return <Chart {...p} {...storeProps} />;
};
