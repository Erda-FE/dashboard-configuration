import React from 'react';
import { Input } from 'antd';
import { DcFormBuilder } from 'src/common';
import ChartEditorStore from 'src/stores/chart-editor';
import DashboardStore from 'src/stores/dash-board';

export default ({ fields: extraFields = [] }: { fields?: any[] }) => {
  const textMap = DashboardStore.getState((s) => s.textMap);
  const { updateEditor } = ChartEditorStore;
  const viewCopy = ChartEditorStore.useStore((s) => s.viewCopy as DC.View);
  const { title, description } = viewCopy || {};

  const fields = [
    {
      label: textMap['Chart title'],
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
      label: textMap['Chart description'],
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
