import * as React from 'react';
import { Modal, Row, Col } from 'antd';
import { map } from 'lodash';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';
import basicCharts from '../../DcCharts';
import './index.scss';

interface IProps {
  onPickChart: (chartType: DC.ViewType) => void;
}

const PickChartModal = ({ onPickChart }: IProps) => {
  const pickChartModalVisible = ChartEditorStore.useStore((s) => s.pickChartModalVisible);
  const [locale, textMap] = DashboardStore.useStore((s) => [s.locale, s.textMap]);
  const { setPickChartModalVisible } = ChartEditorStore;

  const handlePickChart = (chartType: DC.ViewType) => {
    onPickChart(chartType);
    setPickChartModalVisible(false);
  };

  return (
    <Modal
      title={textMap['select chart type']}
      visible={pickChartModalVisible}
      width={600}
      footer={null}
      onCancel={() => setPickChartModalVisible(false)}
    >
      <Row>
        {map(basicCharts, ({ name, enName, image }, chartType) => (
          <Col span={8} key={chartType}>
            <div className="dc-pick-chart-type" onClick={() => handlePickChart(chartType as DC.ViewType)}>
              {image}
              <div className="dc-pick-chart-desc">{locale === 'en' ? enName : name}</div>
            </div>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default PickChartModal;
