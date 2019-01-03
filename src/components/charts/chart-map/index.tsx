/**
 * 全国地图
 */
import React from 'react';
import { connect } from 'dva';
import { merge } from 'lodash';
import { ReactEchartsPropsTypes } from 'echarts-for-react';
import echarts from 'echarts';
import ChartSizeMe from '../chart-sizeme';
// import { mockDataGauge } from './utils';
import ChinaMap from 'files/china.json';

interface IData {
  name: string,
  value: number,
}

interface IProps extends ReturnType<typeof mapStateToProps>, ReactEchartsPropsTypes {
  chartId: string
  isMock?: boolean
}

class ChartMap extends React.Component<IProps> {
  private source = {
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
      formatter(params: any) {
        let value: any[] = (`${params.value}`).split('.');
        value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
        return `${params.seriesName}<br/>${params.name}: ${value}`;
      },
    },
    visualMap: {
      // left: 'right',
      // min: 500000,
      // max: 38000000,
      // inRange: {
      //     color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      // },
      // text:['High','Low'],           // 文本，默认为数值文本
      // calculable: true
    },
    series: [
      {
        name: '中国地图',
        type: 'map',
        roam: true,
        map: 'china',
        itemStyle: {
          emphasis: { label: { show: true } },
        },
        // data: this.props.datas,
      },
    ],
  };

  componentDidMount() {
    echarts.registerMap('china', ChinaMap);
  }


  render() {
    const { option, isMock } = this.props;
    return <ChartSizeMe option={merge(this.source, option)} isMock={isMock} />;
  }
}

// const ChartMap = ({ option = {}, isMock, name, datas }: IProps) => ;

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId, isMock, datas }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    // name: isMock ? mockDataGauge.name : (name || '') as string,
    // datas: isMock ? mockDataGauge.datas : (datas || []) as IData[],
  };
};

export default connect(mapStateToProps)(ChartMap);
