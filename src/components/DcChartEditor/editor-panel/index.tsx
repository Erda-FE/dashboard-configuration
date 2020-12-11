import * as React from 'react';
import { Drawer, Button, Toast, Popover } from '@terminus/nusi';
import { get } from 'lodash';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';
import { getConfig } from '../../../config';
import DataConfig from '../data-config';
import DcContainer from '../../DcContainer';

import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';

import './index.scss';

const noop = () => null;

const EditorPanel = () => {
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
        Toast.warning('请完成数据配置！');
        return;
      }
      amalgamatedOptions = { ...amalgamatedOptions, ...options };
      valiDataConfig();
    });
  };

  const info = getConfig('chartConfigMap')[currentChart.chartType];
  const { Configurator = noop, Component: ChartComponent } = info;

  const CustomNode = ({ ChartNode, render, view, ...props }: any) => render(<ChartNode {...props} />, view);
  const { customRender } = currentChart;

  return (
    <Drawer
      className="dc-editor"
      visible
      width="100%"
      closable={false}
      maskClosable={false}
      bodyStyle={{ height: '100%', background: '#f4f3f7', padding: 0 }}
    >
      <div className="dc-editor-wp v-flex-box flex-space-between full-height auto-overflow">
        <div className="dc-editor-content flex-1 auto-overflow pa12">
          <div className="dc-editor-common-setting v-flex-box py0 px12 auto-overflow white-bg border-radius">
            <div className="dc-editor-setting-title bold-500 fz16 mb8 py8 border-bottom">
              {textMap['parameter configuration']}
            </div>
            <div className="auto-overflow flex-1">
              <Configurator ref={baseConfigFormRef} />
            </div>
          </div>
          <div className="dc-editor-previewer flex-1 mx12 auto-overflow border-radius white-bg">
            <DcContainer viewId={editChartId} view={currentChart}>
              <Choose>
                <When condition={customRender && (typeof customRender === 'function')}>
                  <CustomNode render={customRender} ChartNode={ChartComponent} view={currentChart} />
                </When>
                <Otherwise><ChartComponent /></Otherwise>
              </Choose>
            </DcContainer>
          </div>
          <div className="dc-editor-data-setting v-flex-box py0 px12 white-bg border-radius">
            <div className="dc-editor-setting-title bold-500 fz16 mb8 py8 border-bottom">
              {textMap['datasource configuration']}
            </div>
            <div className="auto-overflow flex-1">
              <DataConfig ref={dataConfigFormRef} />
            </div>
          </div>
        </div>
        <div className="dc-editor-footer px12 py8 white-bg">
          <Button onClick={saveChart} type="primary">{textMap.ok}</Button>
          <Choose>
            <When condition={isTouched}>
              <Popover
                okText={textMap.ok}
                cancelText={textMap.cancel}
                placement="top"
                title={textMap['confirm to drop data']}
                onOk={addMode ? deleteEditor : closeEditor}
              >
                <Button style={{ marginRight: 8 }}>{textMap.cancel}</Button>
              </Popover>
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

export default EditorPanel;
