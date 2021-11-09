import * as React from 'react';
import { Popconfirm, Button, Drawer, Popover } from 'antd';
import { getConfig } from '../../../config';
import DataConfigurator from '../data-config';
import DcContainer from '../../DcContainer';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';

import './index.scss';

const noop = () => null;
const REQUIRED_FIELDS = ['chartType', 'activedMetricGroups', 'valueDimensions'];

const EditorPanel = () => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const [
    viewCopy,
    editChartId,
    isTouched,
    canSave,
    requiredField,
  ] = ChartEditorStore.useStore((s) => [
    s.viewCopy,
    s.editChartId,
    s.isTouched,
    s.canSave,
    s.requiredField,
  ]);

  if (!viewCopy || !editChartId) return null;
  const TipMap = {
    chartType: textMap['chart type'],
    activedMetricGroups: textMap['metrics group'],
    valueDimensions: textMap.value,
  };
  const { saveEditor, resetEditor } = ChartEditorStore;
  const info = getConfig('chartConfigMap')[viewCopy.chartType];
  const { Configurator: CommonConfigForm = noop, Component: ChartComponent } = info || {};
  const completeEditor = () => {
    saveEditor();
    resetEditor();
  };
  const submitTip = () => {
    for (const item of REQUIRED_FIELDS) {
      if (!requiredField?.[item]) {
        return `${textMap['please complete']} ${TipMap[item]}`;
      }
    }

    return '';
  };

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
        <div className="dc-editor-header px16 py12 border-bottom color-text-sub white-bg fz22">{textMap['config charts']}</div>
        <div className="dc-editor-content flex-1 auto-overflow px4 py8">
          <div className="dc-editor-common-setting-setting v-flex-box py0 px12 auto-overflow border-radius">
            <div className="dc-editor-common-title bold-500 color-text-sub fz14 mb8 py8 border-bottom">
              {textMap['common configuration']}
            </div>
            <div className="dc-editor-common-setting-content auto-y-overflow px8 py4 flex-1">
              <CommonConfigForm />
            </div>
          </div>
          <div className="dc-editor-previewer flex-1 mx4 auto-overflow border-radius white-bg box-shadow">
            <DcContainer viewId={editChartId} view={viewCopy}>
              <ChartComponent />
            </DcContainer>
          </div>
          <div className="dc-editor-data-setting v-flex-box py0 px12 border-radius">
            <div className="dc-editor-data-setting-title bold-500 color-text-sub fz14 mb8 py8 border-bottom">
              {textMap['datasource configuration']}
            </div>
            <div className="dc-editor-data-setting-content px8 py4 auto-y-overflow flex-1">
              <DataConfigurator />
            </div>
          </div>
        </div>
        <div className="dc-editor-footer px12 py8">
          <Choose>
            <When condition={canSave}>
              <Button onClick={completeEditor} type="primary">{textMap.ok}</Button>
            </When>
            <Otherwise>
              <Popover
                placement="topRight"
                content={submitTip()}
              >
                <Button onClick={completeEditor} type="primary" disabled={!canSave}>{textMap.ok}</Button>
              </Popover>
            </Otherwise>
          </Choose>
          <Choose>
            <When condition={isTouched}>
              <Popconfirm
                okText={textMap.ok}
                cancelText={textMap.cancel}
                placement="top"
                trigger="click"
                title={textMap['confirm to drop data']}
                onConfirm={resetEditor}
              >
                <Button style={{ marginRight: 8 }}>{textMap.cancel}</Button>
              </Popconfirm>
            </When>
            <Otherwise>
              <Button style={{ marginRight: 8 }} onClick={resetEditor}>{textMap.cancel}</Button>
            </Otherwise>
          </Choose>
        </div>
      </div>
    </Drawer>
  );
};

export default EditorPanel;
