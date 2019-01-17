/**
 * 全国地图
 */
import React from 'react';
import { connect } from 'dva';
import { merge, map } from 'lodash';
import { ReactEchartsPropsTypes } from 'echarts-for-react';
import echarts from 'echarts';
import ChartSizeMe from '../chart-sizeme';
import { mockDataMap } from './utils';
import ChinaMap from './utils/china.json';

interface IProps extends ReturnType<typeof mapStateToProps>, ReactEchartsPropsTypes {
  chartId: string
  isMock?: boolean
}

const formatter = (params: any) => {
  const { data } = params;
  if (!data) return null;
  const value = data.value ? `${data.value}s` : '暂无数据';
  return `${data.name} <br /> ${value} `;
};

class ChartMap extends React.PureComponent<IProps> {
  private source = {
    tooltip: {
      trigger: 'item',
      formatter,
    },
    visualMap: {
      type: 'piecewise',
      pieces: [{ gte: 5 }, { lt: 10 }],
      left: 'left',
      top: 'bottom',
      calculable: true,
    },
    series: map(this.props.datas, value => ({
      name: '全国地图',
      type: 'map',
      mapType: 'china',
      roam: true,
      scaleLimit: {
        min: 0.9,
        max: 6,
      },
      layoutCenter: ['50%', '50%'],
      layoutSize: '130%',
      label: {
        normal: {
          show: true,
        },
        emphasis: {
          show: true,
        },
      },
      data: value.data,
    })),
  };

  componentDidMount() {
    echarts.registerMap('china', ChinaMap);
  }


  render() {
    const { option, isMock, chartId } = this.props;
    return <ChartSizeMe option={merge(this.source, option)} isMock={isMock} chartId={chartId} />;
  }
}

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId, isMock, datas }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    datas: isMock ? mockDataMap.datas : (datas || []),
  };
};

export default connect(mapStateToProps)(ChartMap);
