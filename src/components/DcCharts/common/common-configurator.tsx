import * as React from 'react';
import { Input } from '@terminus/nusi';
import { DcFormBuilder } from '../../../common';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';
import DC from 'src/types';

const textMap = DashboardStore.getState((s) => s.textMap);

export default ({ fields: extraFields = [] }: { fields?: any[] }) => {
  const { updateEditor } = ChartEditorStore;
  const viewCopy = ChartEditorStore.useStore((s) => s.viewCopy as DC.View);
  const { title, description } = viewCopy || {};

  const fields = [
    {
      label: textMap['chart title'],
      name: 'title',
      type: Input,
      required: false,
      initialValue: title,
      customProps: {
        onBlur(e: React.FocusEvent<HTMLInputElement>) {
          updateEditor({ title: e.target.value });
        },
      },
    },
    {
      label: textMap['chart description'],
      name: 'description',
      type: Input.TextArea,
      required: false,
      initialValue: description,
      customProps: {
        onBlur(e: React.FocusEvent<HTMLInputElement>) {
          updateEditor({ description: e.target.value });
        },
      },
    },
    ...extraFields,
  ];

  return <DcFormBuilder fields={fields} />;
};
