import * as React from 'react';
import PickChartModal from './pick-chart-modal';
import EditorPanel from './editor-panel';
import ChartEditorStore from 'src/stores/chart-editor';

const DcChartEditor = () => {
  const { addView } = ChartEditorStore;

  const handlePickChart = (chartType: DC.ViewType) => {
    addView(chartType);
  };

  return (
    <>
      <PickChartModal onPickChart={handlePickChart} />
      <EditorPanel />
    </>
  );
};

export default DcChartEditor;
