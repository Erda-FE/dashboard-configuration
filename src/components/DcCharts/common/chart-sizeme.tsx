import React from 'react';
import DashboardStore from 'src/stores/dash-board';
import ReactEchartsEnhance from 'src/components/DcCharts/react-echarts-enhance';

export interface IProps {
  viewId?: string;
  data: DC.StaticData;
  config?: DC.ChartConfig;
  style?: object;
  theme?: string;
  option?: any;
  onBoardEvent?: Function;
  onEvents?: {
    [key: string]: (...args: any[]) => any;
  };
}

export default ({ style, option, onBoardEvent, onEvents = {}, ...rest }: IProps) => {
  const theme = DashboardStore.useStore((s) => s.theme);
  const { optionProps = {} } = rest?.config || {};
  const ref = React.useRef<ReactEchartsEnhance>(null);
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
    <ReactEchartsEnhance
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
