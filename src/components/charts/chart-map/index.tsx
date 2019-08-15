/**
 * 全国地图
 */
import { map, merge } from 'lodash';

import ChartSizeMe from '../chart-sizeme';
import ChinaMap from './utils/china.json';
import React from 'react';
import { connect } from 'dva';
import { convertSettingToOption } from '../utils';
import echarts from 'echarts';
import { mockDataMap } from './utils';

interface IProps extends ReturnType<typeof mapStateToProps> {
  viewId: string
  isMock: boolean
  defaultOption: object
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
    const { option, isMock, viewId, defaultOption } = this.props;
    return <ChartSizeMe option={merge(this.source, defaultOption, option)} viewId={viewId} />;
  }
}

const mapStateToProps = ({ chartEditor: { viewMap } }: any, { viewId, isMock, datas }: any) => {
  const drawerInfo = viewMap[viewId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    datas: isMock ? mockDataMap.datas : (datas || []),
    option: convertSettingToOption(drawerInfo),
  };
};

export default connect(mapStateToProps)(ChartMap);
