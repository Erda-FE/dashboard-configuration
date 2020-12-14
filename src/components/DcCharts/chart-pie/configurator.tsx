import * as React from 'react';
import { Checkbox } from '@terminus/nusi';
import { get } from 'lodash';
import CommonConfigurator from '../common/common-configurator';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';

const textMap = DashboardStore.getState((s) => s.textMap);

export default () => {
  const viewCopy = ChartEditorStore.useStore(s => s.viewCopy);
  const { updateEditor } = ChartEditorStore;
  const isShowTotal = get(viewCopy, ['config', 'optionProps', 'isShowTotal']);

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
          updateEditor({ config: { optionProps: { isShowTotal: e.target.checked } } });
        },
      },
    },
  ];

  return <CommonConfigurator fields={fields} />;
};
