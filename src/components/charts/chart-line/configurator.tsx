/**
 * 2D 线形图：折线、柱状、曲线
 */
import { get, merge } from 'lodash';
import { Form } from 'antd';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
// import { convertSettingToOption } from '../utils';
import { mockDataLine } from './utils';
import { RenderPureForm } from 'common';
import { collectFields } from 'common/utils';
import { getDefaultOption } from './default-config';

type IType = 'line' | 'bar' | 'area';

interface IData {
  type?: IType
  data: number[]
  smooth?: boolean
  areaStyle?: object // 基本面积图时，传入空的{}即可
}

interface IProps extends ReturnType<typeof mapStateToProps> {
  viewId: string;
  isMock: boolean;
  defaultOption: object;
  currentChart: IChart;
  form: WrappedFormUtils;
  forwardedRef: { current: any };
  formData: any;
}

// const baseAxis = {
//   type: 'category',
//   boundaryGap: true,
// };

// const getAreaType = (type: string) => (type === 'area' ? 'line' : (type || 'line'));
// const getOthers = (type: string) => (type === 'area' ? { areaStyle: {}, smooth: true } : {});
const LineConfigurator = (props: IProps) => {
  const { form, formData, forwardedRef, names, datas, viewId, currentChart } = props;

  const { config: { option } } = currentChart;

  React.useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    forwardedRef.current = form;
  }, [form]);

  React.useEffect(() => {
    const defaultOption = getDefaultOption();

    const originData = { ...defaultOption, ...formData };
    setTimeout(() => {
      const fieldsValues = collectFields(formData);
      form.setFieldsValue(fieldsValues);
      // form.setFieldsValue(originData);
    }, 0);
  }, [formData]);

  // const xAxisType = get(option, ['xAxis', 'type'], 'category');
  // 横轴，纵轴
  const fields = [
    {
      label: 'legend',
      name: 'legend',
      subList: [
        [
          {
            label: 'align',
            name: 'legend.align',
            itemProps: {
              span: 10,
            },
          },
          {
            label: 'bottom',
            name: 'legend.bottom',
            itemProps: {
              span: 10,
            },
          },
        ],
      ],
    },
  ];

  return (
    <div>
      <RenderPureForm
        list={fields}
        form={form}
      />
    </div>
  );
};

const mapStateToProps = ({ chartEditor: { chartMap } }: any, { viewId, isMock, names, datas }: any) => {
  const drawerInfo = chartMap[viewId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    names: isMock ? mockDataLine.names : (names || []) as string[],
    datas: isMock ? mockDataLine.datas : (datas || []) as IData[],
    // option: convertSettingToOption(drawerInfo),
  };
};

export default connect(mapStateToProps)(Form.create()(LineConfigurator));
