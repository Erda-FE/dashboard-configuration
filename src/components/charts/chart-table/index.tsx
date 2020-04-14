/**
 * 数据表格
 */
import React from 'react';
import { connect } from 'dva';
import { Table } from 'antd';

interface IProps extends ReturnType<typeof mapStateToProps> {
  viewId: string;
  results: { [k: string]: any }[];
  cols: { title: string; dataIndex: string; }[];
}

const ChartTable = ({ results = [], cols }: IProps) => (
  <React.Fragment>
    <section className="table-panel">
      <Table
        rowKey="id"
        columns={cols}
        dataSource={results}
        pagination={false}
      />
    </section>
  </React.Fragment>);

const mapStateToProps = ({ chartEditor: { viewMap } }: any, { viewId, data: { metricData: results, cols } }: any) => ({
  results,
  cols,
});

export default connect(mapStateToProps)(ChartTable);
