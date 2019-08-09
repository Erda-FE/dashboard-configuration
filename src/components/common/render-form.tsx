import React from 'react';
import { Form, Row, Col } from 'antd';
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
    const items = list.map((info, i) => {
      if (info.subList) {
        // subList是一个二维数组，第一维是行数， 第二维是每行的具体内容
        const { subList = [], getComp, itemProps = {} } = info;
        const compType = itemProps.type;
        const subRows = subList.map((rowFields: any) => {
          if (!Array.isArray(rowFields) || rowFields.length === 0) {
            return null;
          }
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Row key={`sub-row${i}`}>
              {
                i === 0 && <div className="sub-title">{info.label}</div>
              }
              {rowFields.map((subField, j) => {
                const { itemProps: subItemProps = {} } = subField;
                let { span = 24 } = subItemProps;
                const { type } = subItemProps;
                if (type === 'hidden' || compType === 'hidden') {
                  span = 0;
                }
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Col key={`sub-field${j}`} span={span} >
                    <RenderFormItem
                      form={form}
                      formItemLayout={itemLayout}
                      formLayout={layout}
                      {...subField}
                    />
                  </Col>);
              })}
            </Row>
          );
        });
        if (getComp && compType !== 'hidden') {
          const Comp = getComp;
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Comp key={`sub-comp${i}`}>
              {subRows}
            </Comp>);
        }
        return subRows;
      } else {
        return (<RenderFormItem
          key={info.name || i}
          form={form}
          formItemLayout={itemLayout}
          formLayout={layout}
          {...info}
        />);
      }
    });
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
