/**
 * 数据表格
 */
import React, { useCallback } from 'react';
import { Table as AntdTable } from 'antd';
import { get, map } from 'lodash';
import { Copy } from 'src/common/utils/copy';
import dcRegisterComp from 'src/components/dc-register-comp';
import DashboardStore from 'src/stores/dash-board';

interface IProps {
  results: Array<{ [k: string]: any }>;
  cols: Array<{
    title: string;
    dataIndex: string;
    unit?: string;
    copy?: boolean;
    render?: any;
    i18n?: {
      alias: {
        en: string;
        zh: string;
      };
    };
  }>;
  dataSource?: any[];

  [k: string]: any;
}

const fixedLimit = 5;
const ChartTable = ({ results = [], cols = [], dataSource, ...rest }: IProps) => {
  const { Comp: Table, config } = dcRegisterComp.getComp<typeof AntdTable, IProps['results']>('table', AntdTable);
  const rowClick: DC_COMPONENT_TABLE.IRowClick | undefined = get(rest, 'config.optionProps.rowClick');
  const locale = DashboardStore.getState((s) => s.locale);
  const { onBoardEvent } = rest;
  const isOverLimit = cols.length > fixedLimit;
  const _cols = map(cols, (col, index) => {
    let r = {
      ...col,
      title: col?.i18n?.alias?.[locale] || col?.title,
      key: col.dataIndex,
      ellipsis: true,
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

    if (col.copy) {
      r = {
        ...r,
        render: (v: any) => <Copy className="cursor-copy">{v}</Copy>,
      };
    }

    return r;
  });

  const handleRowClick = useCallback(
    (record: Record<string, any>) => {
      if (typeof onBoardEvent !== 'function') {
        // eslint-disable-next-line no-console
        console.error('props "onBoardEvent" must be a function!');
        return;
      }
      const { name, value } = rowClick || {};
      name &&
        value &&
        onBoardEvent({
          eventName: name,
          cellValue: record[value],
          record,
          dataSource,
        });
    },
    [dataSource, onBoardEvent, rowClick],
  );

  return (
    <React.Fragment>
      <section className="full-height auto-overflow">
        <Table
          onRow={(record) => ({
            onClick: rowClick?.name && rowClick?.value ? () => handleRowClick(record) : undefined,
          })}
          rowKey="c_key"
          columns={_cols}
          dataSource={config?.dataConvert ? config.dataConvert(results) : results}
          rowClassName={(_, index) => (index % 2 === 1 ? 'dark-row' : '')}
          scroll={{ x: '100%' }}
          // scroll={isOverLimit ? { x: fixedWidth + cols.length * 200  } : { }}
          pagination={false}
        />
      </section>
    </React.Fragment>
  );
};

export default ({ data, ...rest }: any) => {
  const { metricData: results, ...restInfos } = data;
  const props = {
    results,
    ...restInfos,
  };
  return <ChartTable {...props} {...rest} />;
};
