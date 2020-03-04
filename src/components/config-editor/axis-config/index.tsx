import * as React from 'react';
import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { get } from 'lodash';
import { connect } from 'dva';
import { RenderPureForm } from '../../common';
// import { collectFields } from '../../common/utils';

import './index.scss';

interface IProps {
  form: WrappedFormUtils;
  currentChart: IChart;
  forwardedRef: { current: any };
  isTouched: boolean;
  setTouched(v: boolean): void;
}

const AxisConfig = ({ form, currentChart, forwardedRef, isTouched, setTouched }: IProps) => {
  React.useEffect(() => {
    forwardedRef.current = form;
    if (!isTouched && form.isFieldsTouched()) {
      setTouched(true);
    }
  }, [form]);

  React.useEffect(() => {
    const [leftAxisData, rightAxisData] = get(currentChart, 'config.option.yAxis');
    let formData = {};
    if (leftAxisData) {
      const { name: lyName, min: lyMin, max: lyMax, interval: lyInterval, axisLabel } = leftAxisData;
      const formatter = get(axisLabel, 'formatter') || '';
      formData = {
        ...formData,
        lyName,
        lyMax,
        lyMin,
        lyInterval,
        lyUnit: formatter.replace(/^{value} /g, ''),
      };
    }
    if (rightAxisData) {
      const { name: ryName, min: ryMin, max: ryMax, interval: ryInterval, axisLabel } = rightAxisData;
      const formatter = get(axisLabel, 'formatter') || '';
      formData = {
        ...formData,
        ryName,
        ryMax,
        ryMin,
        ryInterval,
        ryUnit: formatter.replace(/^{value} /g, ''),
      };
    }
    form.setFieldsValue(formData);
  }, [currentChart]);

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
      name: 'ryName',
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

const mapStateToProps = ({ chartEditor: { viewMap, editChartId, isTouched } }: any) => ({
  isTouched,
  currentChart: get(viewMap, [editChartId]),
});

const mapDispatchToProps = (dispatch: any) => ({
  setTouched(isTouched: any) {
    dispatch({ type: 'chartEditor/setTouched', payload: isTouched });
  },
});

const Config = connect(mapStateToProps, mapDispatchToProps)(Form.create()(AxisConfig));

export default React.forwardRef((props, ref) => (
  <Config forwardedRef={ref} {...props} />
));
