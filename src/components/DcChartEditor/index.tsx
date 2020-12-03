import { Button, message, Tabs, Popconfirm } from 'antd';
import { Drawer } from '@terminus/nusi';
import { get } from 'lodash';
import React from 'react';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';
import { getConfig } from '../../config';
import './index.scss';
import DataConfig from './data-config';
import { DcContainer } from '..';
import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';

const { TabPane } = Tabs;

const noop = () => null;

export default () => {
  const baseConfigFormRef = React.useRef(null as any);
  const dataConfigFormRef = React.useRef(null as any);
  const [
    addMode,
    viewMap,
    editChartId,
    // 配置是否有修改
    isTouched,
  ] = ChartEditorStore.useStore((s) => [
    s.addMode,
    s.viewMap,
    s.editChartId,
    s.isTouched,
  ]);
  const textMap = DashboardStore.useStore((s) => s.textMap);
  const currentChart = React.useMemo(() => get(viewMap, [editChartId]), [viewMap, editChartId]);
  if (!currentChart) {
    return null;
  }

  const { deleteEditor, closeEditor, saveEditor } = ChartEditorStore;

  const saveChart = () => {
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
        amalgamatedOptions = {
          ...amalgamatedOptions,
          ...options,
        };
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
  const { Configurator = noop, Component: ChartComponent } = info;
  const tabPanes = [
    <TabPane tab={textMap['parameter configuration']} key="setting">
      <Configurator ref={baseConfigFormRef} />
    </TabPane>,
    <TabPane tab={textMap['datasource configuration']} key="data">
      <DataConfig ref={dataConfigFormRef} />
    </TabPane>,
  ];

  const CustomNode = ({ ChartNode, render, view, ...props }: any) => render(<ChartNode {...props} />, view);
  const { customRender } = currentChart;

  return (
    <Drawer
      visible
      width="100%"
      closable={false}
      maskClosable={false}
      bodyStyle={{ height: '100%', background: '#f4f3f7', padding: 0 }}
    >
      <div className="dc-editor-mode">
        <div className="dc-editor-content">
          <div className="dc-editor-previewer">
            <DcContainer viewId={editChartId} view={currentChart}>
              <Choose>
                <When condition={customRender && (typeof customRender === 'function')}>
                  <CustomNode render={customRender} ChartNode={ChartComponent} view={currentChart} />
                </When>
                <Otherwise><ChartComponent /></Otherwise>
              </Choose>
            </DcContainer>
          </div>
          <div className="dc-editor-setting">
            <Tabs defaultActiveKey="data">{tabPanes}</Tabs>
          </div>
        </div>
        <div className="dc-editor-footer">
          <Button onClick={saveChart} type="primary">{textMap.ok}</Button>
          <Choose>
            <When condition={isTouched}>
              <Popconfirm
                okText={textMap.ok}
                cancelText={textMap.cancel}
                placement="top"
                title={textMap['confirm to drop data']}
                onConfirm={addMode ? deleteEditor : closeEditor}
              >
                <Button style={{ marginRight: 8 }}>{textMap.cancel}</Button>
              </Popconfirm>
            </When>
            <Otherwise>
              <Button style={{ marginRight: 8 }} onClick={addMode ? deleteEditor : closeEditor}>{textMap.cancel}</Button>
            </Otherwise>
          </Choose>
        </div>
      </div>
    </Drawer>
  );
};
