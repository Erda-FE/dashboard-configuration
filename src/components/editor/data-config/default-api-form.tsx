import * as React from 'react';
import { RenderPureForm } from '../../../common';
import { WrappedFormUtils } from 'antd/lib/form/Form';

interface IProps {
  form: WrappedFormUtils;
  currentChart: any;
  submitResult(result: any): void;
}

export default ({ submitResult, currentChart, form }: IProps) => {
  const getFieldsList = React.useCallback(() => {
    const { api } = currentChart;
    return [
      {
        label: 'API 配置',
        type: 'textArea',
        required: true,
        itemProps: {
          defaultValue: api ? api.url : '',
          placeholder: '请输入 API 的 JSON 配置',
          onBlur: (e: any) => { submitResult({ url: e.target.value }); },
        },
      }];
  }, [currentChart]);
  return <RenderPureForm form={form} layout="vertical" list={getFieldsList()} />;
};
