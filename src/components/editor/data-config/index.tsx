import * as React from 'react';
import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { get } from 'lodash';
import { collectFields } from '../../../common/utils';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';

const dataSourceTypes = [{ value: 'static', name: '静态数据' }, { value: 'api', name: '接口数据' }];

interface IProps {
  form: WrappedFormUtils;
  formData: any;
  contextMap: any;
  forwardedRef: { current: any };
  isTouched: boolean;
  currentChart: DC.View;
  setTouched(v: boolean): void;
  onEditorChange(payload: object): void;
}

const DataConfig = ({ form, formData, forwardedRef, isTouched, setTouched, contextMap, onEditorChange, currentChart }: IProps) => {
  const { getAPIFormComponent } = contextMap;
  const APIFormComponent = getAPIFormComponent();
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

  return (
    <section className="configurator-section">
      <APIFormComponent
        form={form}
        currentChart={currentChart}
        // 覆盖 API 配置 => 合并
        submitResult={(apiObj: any) => onEditorChange({ api: apiObj })}
      />
    </section>
  );
};

const FormConfig = Form.create()(DataConfig);
const Config = (p: any) => {
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
