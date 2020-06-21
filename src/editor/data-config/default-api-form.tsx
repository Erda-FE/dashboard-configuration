import * as React from 'react';
import { RenderPureForm } from '../../components/common';
import { WrappedFormUtils } from 'antd/lib/form/Form';

interface IProps {
  form: WrappedFormUtils;
  submitResult(result: any): void;
  getCurrentChart(): any;
}

export default ({ submitResult, getCurrentChart, form }: IProps) => {
  const getFieldsList = () => [
    {
      label: 'API 配置',
      name: 'data.aaa',
      type: 'textArea',
      required: true,
      itemProps: {
        placeholder: '请输入 API 的 JSON 配置',
      },
    },
    {
      label: 'API 配置',
      name: 'data.aaa',
      type: 'textArea',
      required: true,
      itemProps: {
        placeholder: '请输入 API 的 JSON 配置',
      },
    },
    {
      label: 'API 配置',
      name: 'data.aaa',
      type: 'textArea',
      required: true,
      itemProps: {
        placeholder: '请输入 API 的 JSON 配置',
      },
    },
    {
      label: 'API 配置',
      name: 'data.aaa',
      type: 'textArea',
      required: true,
      itemProps: {
        placeholder: '请输入 API 的 JSON 配置',
      },
    },
    {
      label: 'API 配置',
      name: 'data.aaa',
      type: 'textArea',
      required: true,
      itemProps: {
        placeholder: '请输入 API 的 JSON 配置',
      },
    },
    {
      label: 'API 配置',
      name: 'data.aaa',
      type: 'textArea',
      required: true,
      itemProps: {
        placeholder: '请输入 API 的 JSON 配置',
      },
    },
    {
      label: 'API 配置',
      name: 'data.aaa',
      type: 'textArea',
      required: true,
      itemProps: {
        placeholder: '请输入 API 的 JSON 配置',
      },
    },
  ];
  return <RenderPureForm form={form} layout="vertical" list={getFieldsList()} />;
};
