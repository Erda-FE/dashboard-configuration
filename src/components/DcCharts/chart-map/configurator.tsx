import * as React from 'react';
import { CommonConfigurator } from '../common';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';

const textMap = DashboardStore.getState((s) => s.textMap);

export default () => {
  const viewCopy = ChartEditorStore.useStore(s => s.viewCopy);
  const { updateEditor } = ChartEditorStore;
  const fields = [{}];

  return <CommonConfigurator fields={fields} />;
};

