import { Button, message, Tabs, Popconfirm } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { getData } from '../../utils/comp';
import { getConfig } from '../../config';
import { IF } from '../common';
import './index.scss';
import DataConfig from './data-config';
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
  const { visible, currentChart, closeEditor, addMode, deleteEditor, editChartId, isTouched } = props;
  const baseConfigFormRef = React.useRef(null as any);
  const dataConfigFormRef = React.useRef(null as any);

  const saveChart = () => { // 可以提交图表或控件
    const { saveEditor } = props;
    if (isEmpty(currentChart)) {
      return;
    } else if (!currentChart.chartType && !currentChart.controlType) {
      message.error('请选择图表或者控件');
      return;
    }
    // TODO add validation for each tab
    let amalgamatedOptions = {};
    const valiDataConfig = () => {
      dataConfigFormRef.current.validateFieldsAndScroll((errors: any, options: any) => {
        if (errors) return;
        if (options.staticData) {
          amalgamatedOptions = { ...amalgamatedOptions, ...options, staticData: JSON.parse(options.staticData) };
        }
        if (options.chartQuery) {
          amalgamatedOptions = {
            ...amalgamatedOptions,
            ...options,
            loadData: getData,
          };
        }

        saveEditor(amalgamatedOptions);
      });
    };

    baseConfigFormRef.current.validateFieldsAndScroll((errors: any, options: any) => {
      if (errors) return;
      amalgamatedOptions = { ...amalgamatedOptions, ...options };
      valiDataConfig();
    });
  };

  if (!currentChart) {
    return null;
  }


  const EditorContainer = getConfig('EditorContainer');
  const info = getConfig('chartConfigMap')[currentChart.chartType];
  const { Configurator = noop } = info;
  const { config: { option: chartOptions } } = currentChart;

  return (
    <React.Fragment>
      <div className="editor-holder" />
      <EditorContainer
        visible={visible}
        onClose={addMode ? deleteEditor : closeEditor}
        className="bi-config-editor"
      >
        <div className="bi-config-editor-content">
          <div>
            <Tabs defaultActiveKey="setting">
              <TabPane tab="图表配置" key="setting">
                <PanelCharts />
                <Configurator ref={baseConfigFormRef} currentChart={currentChart} formData={chartOptions} />
              </TabPane>
              <TabPane tab="数据配置" key="data">
                <DataConfig ref={dataConfigFormRef} />
              </TabPane>
              <IF check={!addMode}>
                <TabPane tab="数据系列" key="plot">
                  <p>sasasa</p>
                </TabPane>
                <TabPane tab="轴配置" key="axes">
                  <p>sasasa</p>
                </TabPane>
              </IF>
            </Tabs>
          </div>
        </div>
        <div className="bi-config-editor-footer">
          <div className="bi-config-editor-footer-right">
            {
            isTouched ?
              (
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
              ) :
              (<Button style={{ marginRight: 8 }} onClick={addMode ? deleteEditor : closeEditor}>取消</Button>)
          }
            <Button onClick={saveChart} type="primary">
              {addMode ? '新增' : '保存'}
            </Button>
          </div>
          <div className="bi-config-editor-footer-left">
            {`图表ID: ${editChartId}`}
          </div>
        </div>
      </EditorContainer>
    </React.Fragment>
  );
};

const mapStateToProps = ({
  chartEditor: { visible, addMode, viewMap, editChartId, isTouched },
}: any) => ({
  visible,
  editChartId,
  addMode,
  currentChart: get(viewMap, [editChartId]),
  isTouched,
});

const mapDispatchToProps = (dispatch: any) => ({
  deleteEditor() {
    dispatch({ type: 'chartEditor/deleteEditor' });
  },
  closeEditor() {
    dispatch({ type: 'chartEditor/closeEditor' });
  },
  saveEditor(payload: object) {
    dispatch({ type: 'chartEditor/saveEditor', payload });
  },
  onEditorChange(payload: object) {
    dispatch({ type: 'chartEditor/updateState', payload: { tempView: payload } });
  },
});

export const ChartEditor = connect(mapStateToProps, mapDispatchToProps)(PureChartEditor);
