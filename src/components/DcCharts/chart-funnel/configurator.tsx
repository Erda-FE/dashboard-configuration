import * as React from 'react';
import { Input } from 'antd';
import produce from 'immer';
import DC from 'src/types';
import { CommonConfigurator } from 'src/components/DcCharts/common';
import ChartEditorStore from 'src/stores/chart-editor';
import DashboardStore from 'src/stores/dash-board';

export default () => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const { updateEditor } = ChartEditorStore;
  const viewCopy = ChartEditorStore.useStore((s) => s.viewCopy as DC.View);
  const currentChartConfig = viewCopy?.config || {};
  const optionProps = currentChartConfig.optionProps || {};
  const { unit } = optionProps;

  const updateOptionProps = (_optionProps: Record<string, any>) => {
    updateEditor({
      config: produce(currentChartConfig, (draft) => {
        draft.optionProps = { ...optionProps, ..._optionProps };
      }),
    });
  };

  const fields = [
    {
      label: textMap.unit,
      name: 'unit',
      type: Input,
      required: false,
      initialValue: unit,
      customProps: {
        onBlur(e: React.FocusEvent<HTMLInputElement>) {
          updateOptionProps({ unit: e.target.value });
        },
      },
    },
  ];

  return <CommonConfigurator fields={fields} />;
};
