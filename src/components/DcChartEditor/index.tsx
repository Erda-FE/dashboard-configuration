import * as React from 'react';
import PickChartModal from './pick-chart';
import EditorPanel from './editor-panel';
import ChartEditorStore from '../../stores/chart-editor';

const DcChartEditor = () => {
  const { addEditor } = ChartEditorStore;

  const handlePickChart = (chartType: DC.ViewType) => {
    addEditor(chartType);
  };

  return (
    <>
      <PickChartModal onPickChart={handlePickChart} />
      <EditorPanel />
    </>
  );
};

export default DcChartEditor;
