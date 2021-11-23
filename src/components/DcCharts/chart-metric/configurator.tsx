import * as React from 'react';
import { CommonConfigurator } from 'src/components/DcCharts/common';
import ChartEditorStore from 'src/stores/chart-editor';

export default () => {
  const viewCopy = ChartEditorStore.useStore((s) => s.viewCopy);
  const { updateEditor } = ChartEditorStore;
  const fields = [{}];

  return <CommonConfigurator fields={fields} />;
};
