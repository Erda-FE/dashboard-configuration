import ReactEcharts from 'echarts-for-react';
import React from 'react';
import DashboardStore from '../../../stores/dash-board';
import { getConfig } from '../../../config';

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

type Func = (...args: any[]) => any;

// 重写相关生命周期，用于注册theme
const oldComponentDidMount = ReactEcharts.prototype.componentDidMount as Func;
const oldComponentDidUpdate = ReactEcharts.prototype.componentDidUpdate as Func;

ReactEcharts.prototype.componentDidMount = function (...arg) {
  const { theme } = this.props;
  const themeMap = getConfig('theme');
  let themeObj = themeMap[theme];
  if (!themeObj) {
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.info(`theme ${theme} not registered yet`);
    themeObj = themeMap.dice;
  }
  this.echartsLib.registerTheme(theme, themeObj);
  oldComponentDidUpdate.call(this, ...arg);
};

export default ({ style, option, ...rest }: IProps) => {
  const theme = DashboardStore.useStore((s) => s.theme);

  return <ReactEcharts {...rest} notMerge option={option} theme={theme} style={{ ...style, height: '100%' }} />;
};
