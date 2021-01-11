import * as React from 'react';
import { Input } from '@terminus/nusi';
import produce from 'immer';
import { CommonConfigurator } from '../common';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';

const textMap = DashboardStore.getState((s) => s.textMap);

export default () => {
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
