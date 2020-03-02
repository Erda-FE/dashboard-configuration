import * as React from 'react';
import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { map } from 'lodash';
import { connect } from 'dva';
import { RenderPureForm } from '../../common';
import { collectFields } from '../../common/utils';

import './index.scss';

const dataHandlerList = { handler1: 'handler1', handler2: 'handler2' };

interface IProps {
  form: WrappedFormUtils;
  formData: any;
  forwardedRef: { current: any };
  isTouched: boolean;
  setTouched(v: boolean): void;
}

const AxesConfig = ({ form, formData, forwardedRef, isTouched, setTouched }: IProps) => {
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

  const leftfields = [
    {
      label: '名称',
      name: 'lyName',
      size: 'small',
    },
    {
      label: '最大值',
      name: 'lyMax',
      size: 'small',
      type: 'inputNumber',
      itemProps: {
        precision: 0,
      },
    },
    {
      label: '最小值',
      name: 'lyMin',
      size: 'small',
      type: 'inputNumber',
      itemProps: {
        precision: 0,
      },
    },
    {
      label: '间隔',
      name: 'lyInterval',
      size: 'small',
      type: 'inputNumber',
    },
    {
      label: '单位',
      name: 'lyUnit',
      size: 'small',
    },
  ];

  const rightfields = [
    {
      label: '名称',
      name: 'rName',
      size: 'small',
    },
    {
      label: '最大值',
      name: 'ryMax',
      size: 'small',
      type: 'inputNumber',
      itemProps: {
        precision: 0,
      },
    },
    {
      label: '最小值',
      name: 'ryMin',
      size: 'small',
      type: 'inputNumber',
      itemProps: {
        precision: 0,
      },
    },
    {
      label: '间隔',
      name: 'ryInterval',
      size: 'small',
      type: 'inputNumber',
    },
    {
      label: '单位',
      name: 'ryUnit',
      size: 'small',
    },
  ];

  return (
    <section className="configurator-section">
      <div className="configurator-content">
        <div className="configurator-left">
          <h3>左 Y 轴</h3>
          <RenderPureForm
            list={leftfields}
            form={form}
          />
        </div>
        <div className="configurator-right">
          <h3>右 Y 轴</h3>
          <RenderPureForm
            list={rightfields}
            form={form}
          />
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = ({ chartEditor: { viewMap, editChartId, isTouched } }: any, { viewId, isMock, names, datas }: any) =>
  // const drawerInfo = viewMap[viewId] || {};
  ({
    isTouched,
  });

const mapDispatchToProps = (dispatch: any) => ({
  setTouched(isTouched: any) {
    dispatch({ type: 'chartEditor/setTouched', payload: isTouched });
  },
});

const Config = connect(mapStateToProps, mapDispatchToProps)(Form.create()(AxesConfig));

export default React.forwardRef((props, ref) => (
  <Config forwardedRef={ref} {...props} />
));
