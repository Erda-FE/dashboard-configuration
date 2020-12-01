import * as React from 'react';
import { Table, Input, Button } from 'antd';
import { uniqueId, isEmpty, map, filter, fill, cloneDeep, find, findIndex, reduce, omit } from 'lodash';
import DashboardStore from '../stores/dash-board';
import './kv-table.scss';

interface IProps {
  // eslint-disable-next-line react/no-unused-prop-types
  forwardedRef: React.Ref<any>;
  customValue?: DC.IKVTableValue[];
  onChange: (values: DC.IKVTableValue[]) => void;
}

const KVTable = (props: IProps) => {
  const { customValue = [], onChange } = props;
  const textMap = DashboardStore.useStore((s) => s.textMap);

  const _value = React.useMemo(() => map(customValue, (item) => ({ ...item, uniKey: uniqueId() })), [customValue]);

  const handleChange = React.useCallback((data: DC.IKVTableValue[]) => {
    !isEmpty(data) && onChange(map(data, (item) => omit(item, 'uniKey')));
  }, [onChange]);

  const handleAddEditingValues = () => {
    handleChange([
      ..._value,
      {
        value: undefined,
        name: undefined,
        uniKey: uniqueId(),
      },
    ]);
  };

  const editRule = (rules: any, uniKey: any, items: Array<{ k: string; v: any }>) => {
    if (!uniKey) return;
    const _rules = cloneDeep(rules);
    const rule = find(_rules, { uniKey });
    const index = findIndex(_rules, { uniKey });
    const rest = reduce(items, (acc, { k, v }) => ({ ...acc, [k]: v }), {});
    const newRule = {
      uniKey,
      ...rule,
      ...rest,
    } as any;

    fill(_rules, newRule, index, index + 1);

    return _rules;
  };


  const handleRemoveEditingValues = (uniKey?: string) => {
    uniKey && handleChange(filter(_value, (item) => item.uniKey !== uniKey));
  };

  const handleUpdateEditingValues = (uniKey: any, items: Array<{ k: string; v: any }>) => {
    uniKey && handleChange(editRule(_value, uniKey, items));
  };

  const columns = [
    {
      title: textMap.name,
      dataIndex: 'name',
      render: (v: string, { uniKey }: DC.IKVTableValue) => (
        <Input
          defaultValue={v}
          onBlur={(e) => handleUpdateEditingValues(uniKey, [{ k: 'name', v: e.target.value }])}
        />
      ),
    },
    {
      title: textMap.value,
      dataIndex: 'value',
      render: (v: string, { uniKey }: DC.IKVTableValue) => (
        <Input
          defaultValue={v}
          onBlur={(e) => handleUpdateEditingValues(uniKey, [{ k: 'value', v: e.target.value }])}
        />
      ),
    },
    {
      title: textMap.action,
      width: 80,
      render: ({ uniKey }: DC.IKVTableValue) => <a href="#" onClick={() => handleRemoveEditingValues(uniKey)}>{textMap.delete}</a>,
    },
  ];

  return (
    <div className="dc-kv-table">
      <Button
        className="add-btn"
        type="primary"
        ghost
        onClick={handleAddEditingValues}
      >
        {textMap.add}
      </Button>
      <Table
        bordered
        rowKey="uniKey"
        dataSource={_value}
        columns={columns}
        pagination={{
          pageSize: 5,
          hideOnSinglePage: true,
        }}
      />
    </div>
  );
};

export default React.forwardRef((props: IProps, forwardedRef: React.Ref<any>) => (
  <KVTable forwardedRef={forwardedRef} {...props} />
));
