/**
 * 数据表格
 */
import React from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import { map } from 'lodash';

interface IProps extends ReturnType<typeof mapStateToProps> {
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
          columns={_cols}
          dataSource={results}
          pagination={false}
        />
      </section>
    </React.Fragment>
  );
};

const mapStateToProps = ({ chartEditor: { viewMap } }: any, { viewId, data: { metricData: results, cols } }: any) => ({
  results,
  cols,
});

export default connect(mapStateToProps)(ChartTable);
