import * as React from 'react';
import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { get } from 'lodash';
import { RenderPureForm } from '../../components/common';
import { collectFields } from '../../components/common/utils';
import ChartEditorStore from '../../stores/chart-editor';
import DashboardStore from '../../stores/dash-board';

const dataHandlerList = { handler1: 'handler1', handler2: 'handler2' };
const dataSourceTypes = [{ value: 'static', name: '静态数据' }, { value: 'api', name: '接口数据' }];
const apiMethods = [{ value: 'GET', name: 'GET' }, { value: 'POST', name: 'POST' }];

interface IProps {
  form: WrappedFormUtils;
  formData: any;
  contextMap: any;
  forwardedRef: { current: any };
  isTouched: boolean;
  currentChart: IChart;
  setTouched(v: boolean): void;
  onEditorChange(payload: object): void;
}

const DataConfig = ({ form, formData, forwardedRef, isTouched, setTouched, contextMap, onEditorChange, currentChart }: IProps) => {
  const { getQueryComponent, getPathComponent } = contextMap;
  const QueryComponent = getQueryComponent();
  const PathComponent = getPathComponent();
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

  // let fields = [];
  // const baseFields = [
  //   {
  //     label: '数据源',
  //     name: 'dataSourceType',
  //     type: 'radioGroup',
  //     initialValue: 'static',
  //     options: dataSourceTypes,
  //     size: 'small',
  //   },
  // ];
  const getFields = React.useCallback(() => {
    const _fields = [
      {
        name: 'api.url',
        label: 'api path',
        rules: [{
          message: '请输入请求 path',
          required: true,
        }],
        size: 'small',
        getComp: () => (
          <PathComponent
            submitResult={(result: any) => {
              form.setFieldsValue({ 'api.url': result });
              onEditorChange({ api: { ...currentChart.api, url: result } });
            }}
            getCurrentChart={() => currentChart}
          />
        ),
      },
      {
        name: 'api.method',
        label: 'api method',
        type: 'radioGroup',
        rules: [{
          message: '请选择请求方法',
          required: true,
        }],
        initialValue: 'GET',
        options: apiMethods,
        size: 'small',
        itemProps: {
          onChange(e: any) {
            onEditorChange({ api: { ...currentChart.api, method: e.target.value } });
          },
        },
      },
      {
        name: 'api.query',
        label: 'api query',
        getComp: () => (
          <QueryComponent
            submitResult={(result: any) => {
              form.setFieldsValue({ 'api.query': result });
              onEditorChange({ api: { ...currentChart.api, query: result } });
            }}
            getCurrentChart={() => currentChart}
          />
        ),
      },
    // {
    //   name: 'dataHandler',
    //   label: '数据处理',
    //   type: 'select',
    //   options: map(dataHandlerList, (name, value) => ({ value, name })),
    //   size: 'small',
    // },
    ];
    if (form.getFieldValue('reqMethod') === 'POST') {
      _fields.push({
        name: 'api.body',
        label: 'api body',
        type: 'textArea',
        size: 'small',
        itemProps: {
          placeholder: '请输入JSON格式',
        },
      });
    }
    return _fields;
  }, [QueryComponent, PathComponent, form, currentChart]);

  // if (form.getFieldsValue().dataSourceType === 'static') {
  //   fields = [
  //     ...baseFields,
  //     {
  //       name: 'staticData',
  //       label: '录入数据',
  //       type: 'textArea',
  //       initialValue: currentChart.staticData ? JSON.stringify(currentChart.staticData, null, 2) : '',
  //       itemProps: {
  //         placeholder: '请填写 JSON 格式的数据',
  //         autosize: { minRows: 5, maxRows: 10 },
  //         onBlur(e: any) {
  //           onEditorChange({ staticData: JSON.parse(e.target.value) });
  //         },
  //       },
  //       size: 'small',
  //     },
  //   ];
  // } else {
  //   fields = [
  //     ...baseFields,
  //     {
  //       name: 'reqUrl',
  //       label: 'api path',
  //       type: 'input',
  //       rules: [{
  //         message: '请输入请求 path',
  //         required: true,
  //       }],
  //       size: 'small',
  //     },
  //     {
  //       name: 'reqMethod',
  //       label: 'api method',
  //       type: 'radioGroup',
  //       rules: [{
  //         message: '请选择请求方法',
  //         required: true,
  //       }],
  //       initialValue: 'GET',
  //       options: apiMethods,
  //       size: 'small',
  //     },
  //     {
  //       name: 'reqQuery',
  //       label: 'api query',
  //       type: 'textArea',
  //       size: 'small',
  //       itemProps: {
  //         placeholder: '请输入JSON格式',
  //       },
  //     },
  //     {
  //       name: 'reqBody',
  //       label: 'api body',
  //       type: 'textArea',
  //       size: 'small',
  //       itemProps: {
  //         placeholder: '请输入JSON格式',
  //       },
  //     },
  //     // {
  //     //   name: 'dataHandler',
  //     //   label: '数据处理',
  //     //   type: 'select',
  //     //   options: map(dataHandlerList, (name, value) => ({ value, name })),
  //     //   size: 'small',
  //     // },
  //   ];
  // }

  return (
    <section className="configurator-section">
      <RenderPureForm
        list={getFields()}
        form={form}
      />
    </section>
  );
};

const Config = (p: any) => {
  const FormConfig = Form.create()(DataConfig);
  const [viewMap, editChartId, isTouched] = ChartEditorStore.useStore(s => [s.viewMap, s.editChartId, s.isTouched]);
  const { setTouched, onEditorChange } = ChartEditorStore;
  const contextMap = DashboardStore.useStore(s => s.contextMap);
  const props = {
    isTouched,
    currentChart: get(viewMap, [editChartId]),
    setTouched,
    contextMap,
    onEditorChange,
  };
  return <FormConfig {...props} {...p} />;
};

export default React.forwardRef((props, ref) => (
  <Config forwardedRef={ref} {...props} />
));
