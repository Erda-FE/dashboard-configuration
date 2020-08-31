/**
 * 数据表格
 */
import React from 'react';
import { Table } from 'antd';
import { map } from 'lodash';

interface IProps {
  viewId: string;
  results: { [k: string]: any }[];
  cols: { title: string; dataIndex: string; unit?: string; render?: any }[];
}

const ChartTable = ({ results = [], cols }: IProps) => {
  const _cols = map(cols, (col) => {
    let r = {
      ...col,
      key: col.dataIndex,
    };
    if (col.unit) {
      r = {
        ...r,
        render: (v: any) => `${v}${col.unit}`,
      };
    }
    return r;
  });
  return (
    <React.Fragment>
      <section className="table-panel">
        <Table
          rowKey={'id'}
          columns={_cols}
          dataSource={results}
          pagination={false}
        />
      </section>
    </React.Fragment>
  );
};

export default ({ data: { metricData: results, cols }, ...rest }: any) => {
  const props = {
    results,
    cols,
  };
  return <ChartTable {...props} {...rest} />;
};
