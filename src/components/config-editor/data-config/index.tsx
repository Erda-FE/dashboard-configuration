import * as React from 'react';
import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { map } from 'lodash';
import { connect } from 'dva';
import { RenderPureForm } from '../../common';
import { collectFields } from '../../common/utils';

const dataHandlerList = { handler1: 'handler1', handler2: 'handler2' };
const options = [{ value: 'static', name: '静态数据' }, { value: 'api', name: '接口数据', disabled: true }];

interface IProps {
  form: WrappedFormUtils;
  formData: any;
  forwardedRef: { current: any };
  isTouched: boolean;
  setTouched(v: boolean): void;
}

const DataConfig = ({ form, formData, forwardedRef, isTouched, setTouched }: IProps) => {
  React.useEffect(() => {
    forwardedRef.current = form;
    if (!isTouched && form.isFieldsTouched()) {
      setTouched(true);
    }
  }, [form]);

  React.useEffect(() => {
    setTimeout(() => {
      const fieldsValues = collectFields(formData);
      form.setFieldsValue(fieldsValues);
    }, 0);
  }, [formData]);

  let fields = [];
  const baseFields = [
    {
      label: '数据源',
      name: 'dataSourceType',
      type: 'radioGroup',
      initialValue: 'static',
      options,
    },
  ];

  if (form.getFieldsValue().dataSourceType === 'static') {
    fields = [
      ...baseFields,
      {
        name: 'staticData',
        label: '录入数据',
        type: 'textArea',
        itemProps: {
          placeholder: '请填写 JSON 格式的数据',
          autosize: { minRows: 3, maxRows: 7 },
        },
      },
    ];
  } else {
    fields = [
      ...baseFields,
      {
        name: 'dataAPI',
        label: 'API',
        type: 'input',
      },
      {
        name: 'dataHandler',
        label: '数据处理',
        type: 'select',
        options: map(dataHandlerList, (name, value) => ({ value, name })),
      },
    ];
  }

  return (
    <section className="configurator-section">
      <RenderPureForm
        list={fields}
        form={form}
      />
    </section>
  );
};

const mapStateToProps = ({ chartEditor: { viewMap, isTouched } }: any, { viewId, isMock, names, datas }: any) =>
  // const drawerInfo = viewMap[viewId] || {};
  ({
    isTouched,
  });

const mapDispatchToProps = (dispatch: any) => ({
  setTouched(isTouched: any) {
    dispatch({ type: 'chartEditor/setTouched', payload: isTouched });
  },
});

const Config = connect(mapStateToProps, mapDispatchToProps)(Form.create()(DataConfig));

export default React.forwardRef((props, ref) => (
  <Config forwardedRef={ref} {...props} />
));
