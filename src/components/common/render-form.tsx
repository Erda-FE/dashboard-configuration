import React from 'react';
import { Form } from 'antd';
import classNames from 'classnames';
import { RenderFormItem } from './render-form-item';
import { WrappedFormUtils } from 'antd/lib/form/Form';

interface IProps {
  list: any[];
  form: WrappedFormUtils;
  className?: string | undefined;
  layout?: 'inline' | 'horizontal' | 'vertical' | undefined;
  formItemLayout?: object;
  onlyItems?: boolean;
}

class RenderPureForm extends React.Component<IProps> {
  render() {
    const {
      list, form, className = '', layout = 'horizontal', formItemLayout, onlyItems = false,
    } = this.props;
    const itemLayout = layout === 'horizontal' ? formItemLayout : null;
    const items = list.map((info, i) => (
      <RenderFormItem
        key={info.name || i}
        form={form}
        formItemLayout={itemLayout}
        formLayout={layout}
        {...info}
      />
    ));
    const formClass = classNames(className, 'render-form');
    return onlyItems ? items : (
      <Form className={formClass} layout={layout}>
        {items}
      </Form>
    );
  }
}

const RenderForm = Form.create()(RenderPureForm) as any;

export {
  RenderForm,
  RenderPureForm,
};
