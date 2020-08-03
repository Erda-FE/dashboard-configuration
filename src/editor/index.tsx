import { Button, message, Tabs, Popconfirm } from 'antd';
import { get, isEmpty, set } from 'lodash';
import React from 'react';
import { getData } from '../utils/comp';
import { getConfig } from '../config';
import './index.scss';
import DataConfig from './data-config';
import AxisConfig from './axis-config';
import PanelCharts from './panel-views';
import ChartEditorStore from '../stores/chart-editor';
import DashboardStore from '../stores/dash-board';

const { TabPane } = Tabs;

const noop = () => null;

export default () => {
  const baseConfigFormRef = React.useRef(null as any);
  const dataConfigFormRef = React.useRef(null as any);
  const axesConfigFormRef = React.useRef(null as any);

  const [
    addMode,
    viewMap,
    editChartId,
    isTouched,
    viewCopy,
  ] = ChartEditorStore.useStore(s => [
    s.addMode,
    s.viewMap,
    s.editChartId,
    s.isTouched,
    s.viewCopy,
  ]);
  const textMap = DashboardStore.useStore(s => s.textMap);
  const currentChart = React.useMemo(() => get(viewMap, [editChartId]), [viewMap, editChartId]);
  if (!currentChart) {
    return null;
  }

  const { deleteEditor, closeEditor, saveEditor } = ChartEditorStore;

  const saveChart = () => { // 可以提交图表或控件
    // if (isEmpty(currentChart)) {
    //   return;
    // } else if (!currentChart.chartType && !currentChart.controlType) {
    //   message.error('请选择图表或者控件');
    //   return;
    // }
    // TODO add validation for each tab
    let amalgamatedOptions = {};

    const valiDataConfig = () => {
      dataConfigFormRef.current.validateFieldsAndScroll((errors: any, options: any) => {
        if (errors) return;
        if (options.staticData) {
          amalgamatedOptions = {
            ...amalgamatedOptions,
            ...options,
            staticData: JSON.parse(options.staticData),
          };
        }
        // if (options.chartQuery) {
        // }
        amalgamatedOptions = {
          ...amalgamatedOptions,
          ...options,
          // loadData: getData,
        };
        saveEditor(amalgamatedOptions);
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
      if (!dataConfigFormRef.current) {
        message.warning('请完成数据配置！');
        return;
      }
      amalgamatedOptions = { ...amalgamatedOptions, ...options };
      valiDataConfig();
    });
  };

  const info = getConfig('chartConfigMap')[currentChart.chartType];
  const { Configurator = noop } = info;

  const tabPanes = [
    <TabPane tab={textMap['parameter configuration']} key="setting">
      {/* <PanelCharts /> */}
      <Configurator ref={baseConfigFormRef} />
    </TabPane>,
    <TabPane tab={textMap['datasource configuration']} key="data">
      <DataConfig ref={dataConfigFormRef} />
    </TabPane>,
    // <TabPane tab="轴配置" key="axes">
    //   <AxisConfig ref={axesConfigFormRef} />
    // </TabPane>,
  ];

  return (
    <div className="chart-editor">
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
      > */}
      <div className="chart-editor-content">
        <Tabs defaultActiveKey="setting">{tabPanes}</Tabs>
      </div>
      <div className="chart-editor-header">
        <div className="header-right">
          {
          isTouched ?
            (
              <Popconfirm
                okText={textMap.ok}
                cancelText={textMap.cancel}
                placement="top"
                title={textMap['confirm to drop data']}
                onConfirm={addMode ? deleteEditor : closeEditor}
              >
                <Button style={{ marginRight: 8 }}>{textMap.cancel}</Button>
              </Popconfirm>
            ) :
            (<Button style={{ marginRight: 8 }} onClick={addMode ? deleteEditor : closeEditor}>{textMap.cancel}</Button>)
        }
          <Button onClick={saveChart} type="primary">{textMap.ok}</Button>
        </div>
      </div>
    </div>
  );
};
