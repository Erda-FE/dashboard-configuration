import * as React from 'react';
import { CommonConfigurator } from '../common';
import ChartEditorStore from '../../../stores/chart-editor';

export default () => {
  const viewCopy = ChartEditorStore.useStore((s) => s.viewCopy);
  const { updateEditor } = ChartEditorStore;
  const fields = [{}];

  return <CommonConfigurator fields={fields} />;
};
