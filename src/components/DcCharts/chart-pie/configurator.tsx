import * as React from 'react';
import { Checkbox } from '@terminus/nusi';
import produce from 'immer';
import { CommonConfigurator } from '../common';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';
import DC from 'src/types';

const textMap = DashboardStore.getState((s) => s.textMap);

export default () => {
  const { updateEditor } = ChartEditorStore;
  const viewCopy = ChartEditorStore.useStore((s) => s.viewCopy as DC.View);
  const currentChartConfig = viewCopy?.config || {};
  const optionProps = currentChartConfig.optionProps || {};
  const { isShowTotal } = optionProps;

  const updateOptionProps = (_optionProps: Record<string, any>) => {
    updateEditor({
      config: produce(currentChartConfig, (draft) => {
        draft.optionProps = { ...optionProps, ..._optionProps };
      }),
    });
  };

  const fields = [
    {
      label: textMap.showTotal,
      name: 'config.optionProps.isShowTotal',
      type: Checkbox,
      required: false,
      customProps: {
        defaultChecked: isShowTotal,
        children: textMap['show label'],
        onChange(e: React.FocusEvent<HTMLInputElement>) {
          updateOptionProps({ isShowTotal: e.target.checked });
        },
      },
    },
  ];

  return <CommonConfigurator fields={fields} />;
};
