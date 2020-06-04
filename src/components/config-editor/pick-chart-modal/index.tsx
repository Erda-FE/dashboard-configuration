import * as React from 'react';
import { Modal, Row, Col } from 'antd';
import { map } from 'lodash';
import ChartEditorStore from '../../../stores/chart-editor';
import pickTypes from './pick-types';
import './index.scss';

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
          {map(pickTypes, ({ chartName, chartImg, chartType }) => (
            <Col span={8} key={chartName}>
              <div className="chart-view" onClick={() => handlePickChart(chartType)}>
                {chartImg}
                <div className="desc">{chartName}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Modal>
  );
};
