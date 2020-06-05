import * as React from 'react';
import { Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { get, cloneDeep, set } from 'lodash';
import { RenderPureForm } from '../../components/common';
import ChartEditorStore from '../../stores/chart-editor';

import './index.scss';

interface IProps {
  form: WrappedFormUtils;
  currentChart: IChart;
  forwardedRef: { current: any };
  isTouched: boolean;
  setTouched(v: boolean): void;
  onEditorChange(payload: object): void;
}

const AxisConfig = ({ form, currentChart, forwardedRef, isTouched, setTouched, onEditorChange }: IProps) => {
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
    setTimeout(() => {
      form.setFieldsValue(formData);
    }, 0);
  }, [currentChart]);

  const onAxisConfigChange = (key: string, value: any) => {
    const [yType, ...rest] = key.split('.');
    if (['left', 'right'].includes(yType)) {
      const _config = cloneDeep(currentChart.config);
      const yAxis = get(_config, 'option.yAxis');
      if (yType === 'right') {
        yAxis[1] = yAxis[1] || {};
        set(yAxis[1], rest.join('.'), value);
      } else {
        yAxis[0] = yAxis[0] || {};
        set(yAxis[0], rest.join('.'), value);
      }
      onEditorChange({ config: _config });
    }
  };

  const leftfields = [
    {
      label: '名称',
      name: 'lyName',
      size: 'small',
      itemProps: {
        onBlur(e: any) {
          onAxisConfigChange('left.name', e.target.value);
        },
      },
    },
    {
      label: '最大值',
      name: 'lyMax',
      size: 'small',
      type: 'inputNumber',
      itemProps: {
        precision: 0,
        onChange(v: number) {
          onAxisConfigChange('left.max', v);
        },
      },
    },
    {
      label: '最小值',
      name: 'lyMin',
      size: 'small',
      type: 'inputNumber',
      itemProps: {
        precision: 0,
        onChange(v: number) {
          onAxisConfigChange('left.min', v);
        },
      },
    },
    {
      label: '间隔',
      name: 'lyInterval',
      size: 'small',
      type: 'inputNumber',
      itemProps: {
        onChange(v: number) {
          onAxisConfigChange('left.interval', v);
        },
      },
    },
    {
      label: '单位',
      name: 'lyUnit',
      size: 'small',
      itemProps: {
        onBlur(e: any) {
          onAxisConfigChange('left.axisLabel.formatter', `{value} ${e.target.value}`);
        },
      },
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

const Config = (p: any) => {
  const FormConfig = Form.create()(AxisConfig);
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
