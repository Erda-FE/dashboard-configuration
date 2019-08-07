import { Button, Form, message, Tabs, Popconfirm } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { find, forEach, get, isEmpty } from 'lodash';
import React from 'react';
import { getConfig } from '../../config';
import './index.scss';
import PanelControls from './panel-controls';
import PanelData from './panel-data';
import PanelCharts from './panel-views';

const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
};

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const noop = () => null;

const PureChartEditor = (props: IProps) => {
  const { visible, currentChart, closeEditor, addMode, deleteEditor, editChartId } = props;
  const baseConfigRef = React.useRef(null);

  const saveChart = () => { // 可以提交图表或控件
    const { saveEditor } = props;
    if (isEmpty(currentChart)) {
      return;
    } else if (!currentChart.chartType && !currentChart.controlType) {
      message.error('请选择图表或者控件');
      return;
    }
    // TODO add validation for each tab
    // validateFields((err: any) => {
    // if (err) return;
    saveEditor();
    // });
  };

  if (!currentChart) {
    return null;
  }

  const EditorContainer = getConfig('EditorContainer');
  const info = getConfig('chartsMap')[currentChart.chartType];
  const { Configurator = noop } = info;

  return (
    <EditorContainer
      visible={visible}
      onClose={addMode ? deleteEditor : closeEditor}
      className="bi-config-editor"
    >
      <div className="bi-config-editor-content">
        <div>
          <PanelCharts />
          <Tabs defaultActiveKey="setting">
            <TabPane tab="配置" key="setting">
              <Configurator ref={baseConfigRef} />
            </TabPane>
            <TabPane tab="数据" key="data">
              {/* <PanelData /> */}
            </TabPane>
            <TabPane tab="控件" key="control">
              {/* <PanelControls  /> */}
            </TabPane>
          </Tabs>
        </div>
      </div>
      <div className="bi-config-editor-footer">
        <div className="bi-config-editor-footer-left">
          {`图表ID: ${editChartId}`}
        </div>
        <div className="bi-config-editor-footer-right">
          <Popconfirm
            okText="确认"
            cancelText="取消"
            placement="top"
            title="确认丢弃数据?"
            onConfirm={addMode ? deleteEditor : closeEditor}
          >
            <Button style={{ marginRight: 8 }}>
              取消
            </Button>
          </Popconfirm>
          <Button onClick={saveChart} type="primary">
            {addMode ? '新增' : '保存'}
          </Button>
        </div>
      </div>
    </EditorContainer>
  );
};

const mapStateToProps = ({
  chartEditor: { visible, addMode, chartMap, editChartId },
}: any) => ({
  visible,
  editChartId,
  addMode,
  currentChart: get(chartMap, [editChartId]),
});

const mapDispatchToProps = (dispatch: any) => ({
  deleteEditor() {
    dispatch({ type: 'chartEditor/deleteEditor' });
  },
  closeEditor() {
    dispatch({ type: 'chartEditor/closeEditor' });
  },
  saveEditor() {
    dispatch({ type: 'chartEditor/saveEditor' });
  },
  onEditorChange(payload: object) {
    dispatch({ type: 'chartEditor/updateState', payload: { tempView: payload } });
  },
});

export const ChartEditor = connect(mapStateToProps, mapDispatchToProps)(PureChartEditor);
