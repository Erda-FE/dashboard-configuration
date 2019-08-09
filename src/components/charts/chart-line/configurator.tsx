/**
 * 2D 线形图：折线、柱状、曲线
 */
import { get, merge } from 'lodash';
import { Form } from 'antd';
import ChartSizeMe from '../chart-sizeme';
import React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
// import { convertSettingToOption } from '../utils';
import { mockDataLine } from './utils';
import { RenderPureForm } from 'common';

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
  forwardedRef: any;
  formData: any;
}

const baseAxis = {
  type: 'category',
  boundaryGap: true,
};

const getAreaType = (type: string) => (type === 'area' ? 'line' : (type || 'line'));
const getOthers = (type: string) => (type === 'area' ? { areaStyle: {}, smooth: true } : {});
// const columns = [
//   { title: 'Name', dataIndex: 'name', key: 'name' },
//   { title: 'Age', dataIndex: 'age', key: 'age' },
//   { title: 'Address', dataIndex: 'address', key: 'address' },
//   {
//     title: 'Action',
//     dataIndex: '',
//     key: 'x',
//     render: () => <a href="javascript:;">Delete</a>,
//   },
// ];
const LineConfigurator = ({ form, formData, forwardedRef, defaultOption, isMock, chartType, names, datas, viewId, currentChart }: IProps) => {
  console.log(44, formData);
  const { config: { option } } = currentChart;

  React.useEffect(() => {
    forwardedRef.current = form;
  }, [form]);

  React.useEffect(() => {
    form.setFieldsValue({ ...formData });
  }, [formData]);

  const xAxisType = get(option, ['xAxis', 'type'], 'category');
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
    // {
    //   label: 'app Secret',
    //   name: 'secret',
    //   required: false,
    // },
  ];

  // const syncConfig = () => {
  //   form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log(values);
  //     }
  //   });
  // };

  return (
    <div>
      <RenderPureForm
        // layout="inline"
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
