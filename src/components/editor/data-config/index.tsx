import * as React from 'react';
import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { get } from 'lodash';
import { collectFields } from '../../../common/utils';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';

interface IProps {
  form: WrappedFormUtils;
  formData: any;
  contextMap: any;
  forwardedRef: { current: any };
  isTouched: boolean;
  currentChart: DC.View;
  setTouched: (v: boolean) => void;
  onEditorChange: (payload: object) => void;
}

const DataConfig = ({ form, formData, forwardedRef, isTouched, setTouched, contextMap, onEditorChange, currentChart }: IProps) => {
  const { getAPIFormComponent } = contextMap;
  const APIFormComponent = getAPIFormComponent();

  React.useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    forwardedRef.current = form;
    if (!isTouched && form.isFieldsTouched()) {
      setTouched(true);
    }
  }, [form, forwardedRef, isTouched, setTouched]);

  React.useEffect(() => {
    setTimeout(() => {
      const fieldsValues = collectFields(formData);
      form.setFieldsValue(fieldsValues);
    }, 0);
  }, [form, formData]);

  return (
    <section className="configurator-section">
      <APIFormComponent
        form={form}
        currentChart={currentChart}
        // 覆盖 API 配置 => 合并
        submitResult={(apiObj: any, restConfig: any = {}) => onEditorChange({ api: apiObj, ...restConfig })}
      />
    </section>
  );
};

const FormConfig = Form.create()(DataConfig);
const Config = (p: any) => {
  const [viewMap, editChartId, isTouched] = ChartEditorStore.useStore((s) => [s.viewMap, s.editChartId, s.isTouched]);
  const { setTouched, onEditorChange } = ChartEditorStore;
  const contextMap = DashboardStore.useStore((s) => s.contextMap);
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
