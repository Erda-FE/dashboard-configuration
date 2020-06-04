import { Button, message, Tabs, Popconfirm, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { get, isEmpty, set } from 'lodash';
import React from 'react';
import { getData } from '../../utils/comp';
import { getConfig } from '../../config';
import './index.scss';
import DataConfig from './data-config';
import AxisConfig from './axis-config';
import PanelCharts from './panel-views';
import ChartEditorStore from '../../stores/chart-editor';

const { TabPane } = Tabs;

const noop = () => null;

export const ChartEditor = () => {
  const baseConfigFormRef = React.useRef(null as any);
  const dataConfigFormRef = React.useRef(null as any);
  const axesConfigFormRef = React.useRef(null as any);

  const [
    visible,
    addMode,
    viewMap,
    editChartId,
    isTouched,
    viewCopy,
  ] = ChartEditorStore.useStore(s => [
    s.visible,
    s.addMode,
    s.viewMap,
    s.editChartId,
    s.isTouched,
    s.viewCopy,
  ]);
  const { deleteEditor, closeEditor, saveEditor } = ChartEditorStore;
  const currentChart = get(viewMap, [editChartId]);

  const saveChart = () => { // 可以提交图表或控件
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
        valiAxisConfig();
      });
    };

    const valiAxisConfig = () => {
      axesConfigFormRef.current.validateFieldsAndScroll((errors: any, options: any) => {
        if (errors) return;
        const { lyName, lyMax, lyMin, lyInterval, lyUnit = '', ryName, ryMax, ryMin, ryInterval, ryUnit = '' } = options;
        const yAxis = [
          {
            type: 'value',
            name: lyName,
            max: lyMax,
            min: lyMin,
            interval: lyInterval,
            axisLabel: {
              formatter: `{value} ${lyUnit}`,
            },
          },
          {
            type: 'value',
            name: ryName,
            max: ryMax,
            min: ryMin,
            interval: ryInterval,
            axisLabel: {
              formatter: `{value} ${ryUnit}`,
            },
          },
        ];
        set(amalgamatedOptions, 'config.option.yAxis', yAxis);
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

  const tabPanes = [
    <TabPane tab="图表配置" key="setting">
      <PanelCharts />
      <Configurator ref={baseConfigFormRef} />
    </TabPane>,
    <TabPane tab="数据配置" key="data">
      <DataConfig ref={dataConfigFormRef} />
    </TabPane>,
    <TabPane tab="轴配置" key="axes">
      <AxisConfig ref={axesConfigFormRef} />
    </TabPane>,
  ];

  return (
    <React.Fragment>
      <div className="editor-holder" />
      {/* <EditorContainer
        visible={visible}
        onClose={addMode ? deleteEditor : closeEditor}
        bodyStyle={{
          padding: 0,
          height: '350px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="bi-config-editor-content">
          <Tabs defaultActiveKey="setting" size="small">{tabPanes}</Tabs>
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
                  <Button size="small" style={{ marginRight: 8 }}>
                    取消
                  </Button>
                </Popconfirm>
              ) :
              (<Button size="small" style={{ marginRight: 8 }} onClick={addMode ? deleteEditor : closeEditor}>取消</Button>)
          }
            <Button size="small" onClick={saveChart} type="primary">
              {addMode ? '新增' : '保存'}
            </Button>
          </div>
          <div className="bi-config-editor-footer-left">
            {`图表ID: ${editChartId}`}
          </div>
        </div>
      </EditorContainer> */}
    </React.Fragment>
  );
};
