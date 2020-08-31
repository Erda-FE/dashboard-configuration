import * as React from 'react';
import { Modal, Row, Col } from 'antd';
import { map } from 'lodash';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';
import basicCharts from '../../views';
import './index.scss';

interface IProps {
  onPickChart: (chartType: ChartType) => void
}

export default ({ onPickChart }: IProps) => {
  const [pickChartModalVisible] = ChartEditorStore.useStore(s => [s.pickChartModalVisible]);
  const textMap = DashboardStore.useStore(s => s.textMap);
  const { setPickChartModalVisible } = ChartEditorStore;

  const handlePickChart = (chartType: ChartType) => {
    onPickChart(chartType);
    setPickChartModalVisible(false);
  };

  return (
    <Modal
      title={textMap['select chart type']}
      visible={pickChartModalVisible}
      width={600}
      onCancel={() => setPickChartModalVisible(false)}
      footer={null}
    >
      <Row>
        {map(basicCharts, ({ name, image }, chartType) => (
          <Col span={8} key={chartType}>
            <div className="dc-pick-chart-type" onClick={() => handlePickChart(chartType as ChartType)}>
              {image}
              <div className="dc-pick-chart-desc">{name}</div>
            </div>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};
