/**
 * 2D 线形图：折线、柱状、曲线
 */
import { merge, map } from 'lodash';
import { Form } from 'antd';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
// import { convertSettingToOption } from '../utils';
import { mockDataLine } from './utils';
import { RenderPureForm } from '../../common';
import { collectFields } from '../../common/utils';
import { getDefaultOption } from './option';

type IType = 'line' | 'bar' | 'area';

interface IData {
  type?: IType
  data: number[]
  smooth?: boolean
  areaStyle?: object // 基本面积图时，传入空的{}即可
}

// tslint:disable-next-line: no-use-before-declare
interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  viewId: string;
  isMock: boolean;
  defaultOption: object;
  currentChart: IChart;
  form: WrappedFormUtils;
  forwardedRef: { current: any };
  formData: any;
}

const LineConfigurator = (props: IProps) => {
  const { form, formData, forwardedRef, names, datas, viewId, currentChart, setTouched, isTouched } = props;

  React.useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    forwardedRef.current = form;
    if (!isTouched && form.isFieldsTouched()) {
      setTouched(true);
    }
  }, [form]);

  React.useEffect(() => {
    setTimeout(() => {
      const defaultOption = getDefaultOption();
      const fieldsValues = collectFields(formData);
      form.setFieldsValue(merge(defaultOption, fieldsValues));
    }, 0);
  }, [formData]);

  const periodList = { static: '静态数据', api: '接口数据' };
  const dataHandlerList = { handler1: 'handler1', handler2: 'handler2' };

  const baseFields = [
    {
      label: '标题',
      name: 'title',
      type: 'input',
    },
    {
      label: '描述',
      name: 'description',
      type: 'textArea',
    },
    {
      label: '数据源',
      name: 'dataSourceType',
      type: 'radioGroup',
      initialValue: 'static',
      options: [{ value: 'static', name: '静态数据' }, { value: 'api', name: '接口数据', disabled: true }],
    },
    // {
    //   label: 'tooltip',
    //   subList: [
    //     [
    //       {
    //         label: 'trigger',
    //         tooltip: '触发类型',
    //         name: 'tooltip.trigger',
    //         initialValue: 'axis',
    //         type: 'select',
    //         options: ['item', 'axis', 'none'].map(d => ({ name: d, value: d })),
    //         itemProps: {
    //           span: 4,
    //         },
    //       },
    //       {
    //         label: 'transitionDuration',
    //         tooltip: '提示框浮层的移动动画过渡时间，单位是 s，设置为 0 的时候会紧跟着鼠标移动。',
    //         name: 'tooltip.transitionDuration',
    //         initialValue: '0',
    //         type: 'inputNumber',
    //         itemProps: {
    //           span: 4,
    //         },
    //       },
    //       {
    //         label: 'confine',
    //         tooltip: '是否将 tooltip 框限制在图表的区域内。',
    //         name: 'tooltip.confine',
    //         initialValue: true,
    //         type: 'select',
    //         options: [{ name: 'true', value: true }, { name: 'false', value: false }],
    //         itemProps: {
    //           span: 4,
    //         },
    //       },
    //     ],
    //   ],
    // },
    // {
    //   label: 'legend',
    //   subList: [
    //     [
    //       {
    //         label: 'bottom',
    //         name: 'legend.bottom',
    //         tooltip: '图例组件离容器下侧的距离。',
    //         type: 'inputNumber',
    //         itemProps: {
    //           span: 4,
    //         },
    //       },
    //       {
    //         label: 'orient',
    //         name: 'legend.orient',
    //         tooltip: '图例列表的布局朝向。',
    //         type: 'select',
    //         options: ['horizontal', 'vertical'].map(d => ({ name: d, value: d })),
    //         itemProps: {
    //           span: 4,
    //         },
    //       },
    //       {
    //         label: 'align',
    //         name: 'legend.align',
    //         type: 'select',
    //         options: ['auto', 'left', 'right'].map(d => ({ name: d, value: d })),
    //         tooltip: '图例标记和文本的对齐。默认自动，根据组件的位置和 orient 决定，当组件的 left 值为 \'right\' 以及纵向布局（orient 为 \'vertical\'）的时候为右对齐，及为 \'right\'。',
    //         itemProps: {
    //           span: 4,
    //         },
    //       },
    //       {
    //         label: 'type',
    //         name: 'legend.type',
    //         type: 'select',
    //         options: ['plain', 'scroll'].map(d => ({ name: d, value: d })),
    //         tooltip: '图例的类型',
    //         itemProps: {
    //           span: 4,
    //         },
    //       },
    //     ],
    //   ],
    // },
  ];

  let fields = [];
  if (form.getFieldsValue().dataSourceType === 'static') {
    fields = [
      ...baseFields,
      {
        name: 'dataSource',
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
        // initialValue: 'da',
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

const mapStateToProps = ({ chartEditor: { viewMap, isTouched } }: any, { viewId, isMock, names, datas }: any) => {
  const drawerInfo = viewMap[viewId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    names: isMock ? mockDataLine.names : (names || []) as string[],
    datas: isMock ? mockDataLine.datas : (datas || []) as IData[],
    // option: convertSettingToOption(drawerInfo),
    isTouched,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setTouched(isTouched: any) {
    dispatch({ type: 'chartEditor/setTouched', payload: isTouched });
  },
});

const Configurator = connect(mapStateToProps, mapDispatchToProps)(Form.create()(LineConfigurator));

export default React.forwardRef((props, ref) => (
  <Configurator forwardedRef={ref} {...props} />
));
