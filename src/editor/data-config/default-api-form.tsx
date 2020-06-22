import * as React from 'react';
import { RenderPureForm } from '../../components/common';
import { WrappedFormUtils } from 'antd/lib/form/Form';

interface IProps {
  form: WrappedFormUtils;
  submitResult(result: any): void;
  getCurrentChart(): any;
}

export default ({ submitResult, getCurrentChart, form }: IProps) => {
  const getFieldsList = React.useCallback(() => {
    const { api } = getCurrentChart();
    return [
      {
        label: 'API 配置',
        type: 'textArea',
        required: true,
        itemProps: {
          defaultValue: api.url,
          placeholder: '请输入 API 的 JSON 配置',
          onBlur: (e: any) => { submitResult({ url: e.target.value }); },
        },
      }];
  }, [getCurrentChart]);
  return <RenderPureForm form={form} layout="vertical" list={getFieldsList()} />;
};
