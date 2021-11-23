import * as React from 'react';
import { Checkbox } from 'antd';
import produce from 'immer';
import { CommonConfigurator } from 'src/components/DcCharts/common';
import ChartEditorStore from 'src/stores/chart-editor';
import DashboardStore from 'src/stores/dash-board';

export default () => {
  const textMap = DashboardStore.getState((s) => s.textMap);
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
