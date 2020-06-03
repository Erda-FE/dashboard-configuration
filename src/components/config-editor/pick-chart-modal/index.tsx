import * as React from 'react';
import { Modal, Row, Col } from 'antd';
import { map } from 'lodash';
import ChartEditorStore from '../../../stores/chart-editor';
import './index.scss';

const pickCharts = [
  {
    chartName: '线形图',
    chartType: 'chart:line',
    chartImg: 'images/line-chart-select.svg',
  },
  {
    chartName: '面积图',
    chartType: 'chart:area',
    chartImg: '/images/area-chart-select.svg',
  },
  {
    chartName: '柱状图',
    chartType: 'chart:bar',
    chartImg: '/images/bar-chart-select.svg',
  },
  {
    chartName: '饼图',
    chartType: 'chart:pie',
    chartImg: '/images/pie-chart-select.svg',
  },
  {
    chartName: '表格',
    chartType: 'table',
    chartImg: '/images/table-chart-select.svg',
  },
  {
    chartName: '指标',
    chartType: 'card',
    chartImg: '/images/metric-chart-select.svg',
  },
];

interface IProps {
  onPickChart: (chartType: string) => void
}

export default ({ onPickChart }: IProps) => {
  const [pickChartModalVisible] = ChartEditorStore.useStore(s => [s.pickChartModalVisible]);
  const { setPickChartModalVisible } = ChartEditorStore;

  const handlePickChart = (chartType: string) => {
    onPickChart(chartType);
    setPickChartModalVisible(false);
  };

  return (
    <Modal
      title="选择图表类型"
      visible={pickChartModalVisible}
      width={600}
      onCancel={() => setPickChartModalVisible(false)}
      footer={null}
    >
      <div className="pick-chart-wp">
        <Row>
          {map(pickCharts, ({ chartName, chartImg, chartType }) => (
            <Col span={8} key={chartName}>
              <div className="chart-view" onClick={() => handlePickChart(chartType)}>
                <img className="logo" src={chartImg} />
                <div className="desc">{chartName}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Modal>
  );
};
