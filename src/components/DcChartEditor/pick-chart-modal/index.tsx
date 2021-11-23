import * as React from 'react';
import { Col, Modal, Row } from 'antd';
import { map } from 'lodash';
import ChartEditorStore from 'src/stores/chart-editor';
import DashboardStore from 'src/stores/dash-board';
import basicCharts from 'src/components/DcCharts';
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
      maskClosable
      onCancel={() => setPickChartModalVisible(false)}
    >
      <Row>
        {map(basicCharts, ({ name, enName, image }: DC.ViewDefItem, chartType) => (
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
