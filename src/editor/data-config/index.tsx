import * as React from 'react';
import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { get, map } from 'lodash';
import { RenderPureForm } from '../../components/common';
import { collectFields } from '../../components/common/utils';
import ChartEditorStore from '../../stores/chart-editor';

const dataHandlerList = { handler1: 'handler1', handler2: 'handler2' };
const dataSourceTypes = [{ value: 'static', name: '静态数据' }, { value: 'api', name: '接口数据' }];
const apiMethods = [{ value: 'GET', name: 'GET' }, { value: 'POST', name: 'POST' }];

interface IProps {
  form: WrappedFormUtils;
  formData: any;
  forwardedRef: { current: any };
  isTouched: boolean;
  currentChart: IChart;
  setTouched(v: boolean): void;
  onEditorChange(payload: object): void;
}

const DataConfig = ({ form, formData, forwardedRef, isTouched, setTouched, onEditorChange, currentChart }: IProps) => {
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
      options: dataSourceTypes,
      size: 'small',
    },
  ];

  if (form.getFieldsValue().dataSourceType === 'static') {
    fields = [
      ...baseFields,
      {
        name: 'staticData',
        label: '录入数据',
        type: 'textArea',
        initialValue: currentChart.staticData ? JSON.stringify(currentChart.staticData, null, 2) : '',
        itemProps: {
          placeholder: '请填写 JSON 格式的数据',
          autosize: { minRows: 5, maxRows: 10 },
          onBlur(e: any) {
            onEditorChange({ staticData: JSON.parse(e.target.value) });
          },
        },
        size: 'small',
      },
    ];
  } else {
    fields = [
      ...baseFields,
      {
        name: 'reqUrl',
        label: 'api url',
        type: 'input',
        rules: [{
          message: '请输入请求 url',
          required: true,
        }],
        size: 'small',
      },
      {
        name: 'reqMethod',
        label: 'api method',
        type: 'radioGroup',
        rules: [{
          message: '请选择请求方法',
          required: true,
        }],
        initialValue: 'GET',
        options: apiMethods,
        size: 'small',
      },
      {
        name: 'reqQuery',
        label: 'api query',
        type: 'textArea',
        size: 'small',
        itemProps: {
          placeholder: '请输入JSON格式',
        },
      },
      {
        name: 'reqBody',
        label: 'api body',
        type: 'textArea',
        size: 'small',
        itemProps: {
          placeholder: '请输入JSON格式',
        },
      },
      {
        name: 'dataHandler',
        label: '数据处理',
        type: 'select',
        options: map(dataHandlerList, (name, value) => ({ value, name })),
        size: 'small',
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

const Config = (p: any) => {
  const FormConfig = Form.create()(DataConfig);
  const [viewMap, editChartId, isTouched] = ChartEditorStore.useStore(s => [s.viewMap, s.editChartId, s.isTouched]);
  const { setTouched, onEditorChange } = ChartEditorStore;
  const props = {
    isTouched,
    currentChart: get(viewMap, [editChartId]),
    setTouched,
    onEditorChange,
  };
  return <FormConfig {...props} {...p} />;
};

export default React.forwardRef((props, ref) => (
  <Config forwardedRef={ref} {...props} />
));
