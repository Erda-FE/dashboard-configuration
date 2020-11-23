import React, { useEffect, useMemo } from 'react';
import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { get } from 'lodash';
// import { collectFields } from '../../../common/utils';
import ChartEditorStore from '../../../stores/chart-editor';
import DashboardStore from '../../../stores/dash-board';

interface IProps {
  form: WrappedFormUtils;
  formData: any;
  forwardedRef: { current: any };
}

const DataConfig = ({ form, formData, forwardedRef }: IProps) => {
  const [viewMap, editChartId, isTouched] = ChartEditorStore.useStore((s) => [s.viewMap, s.editChartId, s.isTouched]);
  const { getAPIFormComponent } = DashboardStore.useStore((s) => s.contextMap);
  const { setTouched, onEditorChange } = ChartEditorStore;

  const currentChart = useMemo(() => get(viewMap, [editChartId]), [editChartId, viewMap]);
  const APIFormComponent = useMemo(() => getAPIFormComponent(), [getAPIFormComponent]);

  useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    forwardedRef.current = form;
    if (!isTouched && form.isFieldsTouched()) {
      setTouched(true);
    }
  }, [form, forwardedRef, isTouched, setTouched]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     const fieldsValues = collectFields(formData);
  //     form.setFieldsValue(fieldsValues);
  //   }, 0);
  // }, [form, formData]);

  return (
    <section className="configurator-section">
      <APIFormComponent
        form={form}
        currentChart={currentChart}
        submitResult={(apiObj: any, restConfig: any = {}) => onEditorChange({ api: apiObj, ...restConfig })}
      />
    </section>
  );
};

const FormConfig = Form.create()(DataConfig);

export default React.forwardRef((props, ref) => <FormConfig forwardedRef={ref} {...props} />);
