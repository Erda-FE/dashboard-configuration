/**
 * 公用的dataSettings
 */
import React from 'react';
import { FormComponentProps } from 'antd/lib/form';
import { panelControlPrefix, positiveIntRegExp } from '../../../utils/constants';
import { formItemLayout } from '../../../utils/comp';
import { RenderForm } from '../../../components/common';

const DataSettings = ({ form }: FormComponentProps) => {
  const { getFieldDecorator } = form;
  const fields = [
    {
      label: '控件宽度',
      name: `${panelControlPrefix}width`,
      initialValue: 120,
      rules: [{
        required: true,
        message: '请输入控件宽度',
      }, {
        pattern: positiveIntRegExp,
        message: '请输入正整数',
      }],
    },
    {
      label: '参数名称',
      name: `${panelControlPrefix}searchName`,
      rules: [{
        required: true,
        message: '请输入在接口中的查询名称',
      }],
      itmeProps: {
        placeholder: '请输入在接口中的查询名称，一般为英文，示例：id',
      },
    },
  ];
  return (
    <RenderForm
      layout="inline"
      formItemLayout={formItemLayout}
      list={fields}
    />
    // <React.Fragment>
    //   <Form.Item label="控件宽度" {...formItemLayout}>
    //     {getFieldDecorator(`${panelControlPrefix}width`, {
    //       initialValue: 120,
    //       rules: [{
    //         required: true,
    //         message: '请输入控件宽度',
    //       }, {
    //         pattern: positiveIntRegExp,
    //         message: '请输入正整数',
    //       }],
    //     })(<Input placeholder="请输入控件宽度" />)}
    //   </Form.Item>
    //   <Form.Item label="参数名称" {...formItemLayout}>
    //     {getFieldDecorator(`${panelControlPrefix}searchName`, {
    //       rules: [{
    //         required: true,
    //         message: '请输入在接口中的查询名称',
    //       }],
    //     })(<Input placeholder="请输入在接口中的查询名称，一般为英文，示例：id" />)}
    //   </Form.Item>
    // </React.Fragment>
  );
};

export default DataSettings;
