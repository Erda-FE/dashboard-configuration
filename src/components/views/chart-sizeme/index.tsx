import ReactEcharts, { Func } from 'echarts-for-react';
import { isEqual } from 'lodash';
import React from 'react';
import DashboardStore from '../../../stores/dash-board';
import { getConfig } from '../../../config';
// import 'echarts/map/js/china';
// import 'echarts/map/js/province/zhejiang';

interface IProps {
  viewId: string
  data: object
  config: {
    option: object
  }
  style?: object
  theme: string
  option: any
  // getOption(data: object, customOption: object): object
}

// 重写相关生命周期，用于注册theme
const oldComponentDidMount = ReactEcharts.prototype.componentDidMount as Func;
const oldComponentDidUpdate = ReactEcharts.prototype.componentDidUpdate as Func;

ReactEcharts.prototype.componentDidMount = function (...arg) {
  const { theme } = this.props;
  const themeMap = getConfig('theme');
  let themeObj = themeMap[theme];
  if (!themeObj) {
    console.info(`theme ${theme} not registered yet`);
    themeObj = themeMap.dice;
  }
  this.echartsLib.registerTheme(theme, themeObj);
  oldComponentDidMount.call(this, ...arg);
};

ReactEcharts.prototype.componentDidUpdate = function (...arg) {
  const { theme } = this.props;
  const themeMap = getConfig('theme');
  let themeObj = themeMap[theme];
  if (!themeObj) {
    console.info(`theme ${theme} not registered yet`);
    themeObj = themeMap.dice;
  }
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
    const { data, config = {}, style, option, theme, ...others } = this.props;
    return (
      <ReactEcharts
        {...others}
        option={option}
        theme={theme}
        style={{ ...style, height: '100%' }}
      />
    );
  }
}

export default (p: any) => {
  const theme = DashboardStore.useStore(s => s.theme);
  return <Chart {...p} theme={theme} />;
};
