import ReactEcharts, { Func } from 'echarts-for-react';
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

export default ({ style, option, onBoardEvent, onEvents = {}, ...rest }: IProps) => {
  const theme = DashboardStore.useStore((s) => s.theme);
  const { optionProps = {} } = rest?.config || {};
  const ref = React.useRef(null);
  const { useBrush = true } = optionProps;
  const { time = [] } = option || {};

  if (onBoardEvent && useBrush) {
    Object.assign(onEvents, {
      click: (params: { dataIndex: number }) => {
        const timeGap = time[1] - time[0];
        onBoardEvent?.({ start: time[params?.dataIndex], end: Number(time[params?.dataIndex]) + timeGap });
      },
      brushSelected: (params: any) => {
        const brushComponent = params.batch[0];
        for (let sIdx = 0; sIdx < brushComponent?.selected.length; sIdx++) {
          const { dataIndex } = brushComponent?.selected[sIdx];
          const start = time?.[dataIndex[0]];
          const end = time?.[dataIndex[dataIndex.length - 1]];
          onBoardEvent?.({ start, end });
        }
      },
    });
  }

  React.useEffect(() => {
    if (useBrush) {
      ref.current &&
        ref.current.getEchartsInstance().dispatchAction({
          type: 'takeGlobalCursor',
          key: 'brush',
          brushOption: {
            brushType: 'lineX',
            brushMode: 'multiple',
          },
        });
    }
  }, [time]);

  return (
    <ReactEcharts
      {...rest}
      ref={ref}
      notMerge
      option={option}
      onEvents={onEvents}
      theme={theme}
      style={{ ...style, height: '100%' }}
    />
  );
};
