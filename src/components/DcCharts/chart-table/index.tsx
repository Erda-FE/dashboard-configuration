/**
 * 数据表格
 */
import React from 'react';
import { Table } from '@terminus/nusi';
import { map } from 'lodash';

interface IProps {
  results: Array<{ [k: string]: any }>;
  cols: Array<{ title: string; dataIndex: string; unit?: string; render?: any }>;
}

const fixedLimit = 5;
const fixedWidth = 150;
const ChartTable = ({ results = [], cols = [] }: IProps) => {
  const isOverLimit = cols.length > fixedLimit;
  const _cols = map(cols, (col, index) => {
    let r = {
      ...col,
      key: col.dataIndex,
    };
    if (index === 0 && isOverLimit) {
      r = {
        ...r,
        // width: fixedWidth,
        // fixed: 'left',
      };
    }
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
      <section className="full-height auto-overflow">
        <Table
          rowKey="c_key"
          columns={_cols}
          dataSource={results}
          rowClassName={(_, index) => (index % 2 === 1 ? 'dark-row' : '')}
          // scroll={isOverLimit ? { x: fixedWidth + cols.length * 200  } : { }}
          pagination={false}
        />
      </section>
    </React.Fragment>
  );
};

export default ({ data, ...rest }: any) => {
  const { metricData: results, cols } = data;
  const props = {
    results,
    cols,
  };
  return <ChartTable {...props} {...rest} />;
};
