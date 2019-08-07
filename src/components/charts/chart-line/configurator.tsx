/**
 * 2D 线形图：折线、柱状、曲线
 */
import { get, merge } from 'lodash';

import ChartSizeMe from '../chart-sizeme';
import React from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import { convertSettingToOption } from '../utils';
import { mockDataLine } from './utils';
import { RenderForm } from 'common';

type IType = 'line' | 'bar' | 'area';

interface IData {
  type?: IType
  data: number[]
  smooth?: boolean
  areaStyle?: object // 基本面积图时，传入空的{}即可
}

interface IProps extends ReturnType<typeof mapStateToProps> {
  viewId: string
  isMock: boolean
  defaultOption: object
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
const LineConfigurer = ({ option = {}, defaultOption, isMock, chartType, names, datas, viewId }: IProps) => {
  const xAxisType = get(option, ['xAxis', 'type'], 'category');
  // 横轴，纵轴

  const fields = [
    {
      label: 'app Key',
      name: 'key',
    },
    {
      label: 'app Secret',
      name: 'secret',
      required: false,
    },
  ];

  return (
    <div>
      <RenderForm
        layout="inline"
        list={fields}
      />
      {/* <Table
        columns={columns}
        expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
        dataSource={data}
      /> */}
    </div>
  );
};

const mapStateToProps = ({ chartEditor: { chartMap } }: any, { viewId, isMock, names, datas }: any) => {
  const drawerInfo = chartMap[viewId] || {};
  return {
    chartType: drawerInfo.chartType as string,
    names: isMock ? mockDataLine.names : (names || []) as string[],
    datas: isMock ? mockDataLine.datas : (datas || []) as IData[],
    option: convertSettingToOption(drawerInfo),
  };
};

export default connect(mapStateToProps)(LineConfigurer);
