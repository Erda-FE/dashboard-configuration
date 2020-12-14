import * as React from 'react';
import { Input } from '@terminus/nusi';
import { get } from 'lodash';
import { CommonConfigurator } from '../common';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';

const textMap = DashboardStore.getState((s) => s.textMap);

export default () => {
  const viewCopy = ChartEditorStore.useStore(s => s.viewCopy);
  const unit = get(viewCopy, ['config', 'optionProps', 'unit'])
  const { updateEditor } = ChartEditorStore;
  const fields = [
    {
      label: textMap.unit,
      name: 'config.optionProps.unit',
      type: Input,
      required: false,
      initialValue: unit,
      customProps: {
        onBlur(e: React.FocusEvent<HTMLInputElement>) {
          updateEditor({ config: { optionProps: { unit: e.target.value } } });
        },
      },
    },
  ];

  return <CommonConfigurator fields={fields} />;
};
