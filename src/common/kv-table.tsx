import * as React from 'react';
import { Table, Input, Button } from 'antd';
import { uniqueId, isEmpty, map, filter, fill, cloneDeep, find, findIndex, reduce, omit } from 'lodash';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { useUpdate } from '../common';
import DashboardStore from '../stores/dash-board';
import './kv-table.scss';

export interface IValue {
  value: string
  name: string
  uniKey?: string
}

interface IProps {
  value?: IValue[]
  form?: WrappedFormUtils
  onChange(values: Array<IValue>): void
}

const KVTable = (props: IProps) => {
  const { value, onChange, form } = props;
  const textMap = DashboardStore.useStore(s => s.textMap);
  const triggerChange = React.useCallback(onChange, []);

  const [{ editingValues }, updater] = useUpdate({
    editingValues: [],
  });

  React.useEffect(() => {
    let v = [] as IValue[];
    if (!isEmpty(value)) {
      v = map(value, item => ({ ...item, uniKey: uniqueId() }));
    }
    updater.editingValues(v);
  }, [value]);

  React.useEffect(() => {
    const validVal = map(editingValues, item => item.key && item.value);
    !isEmpty(validVal) && triggerChange(map(validVal, item => omit(item, 'unikey')));
  }, [editingValues, triggerChange]);

  const handleAddEditingValues = () => {
    updater.editingValues([
      {
        value: undefined,
        name: undefined,
        uniKey: uniqueId(),
      },
      ...editingValues,
    ]);
  };

  const editRule = (rules: any, uniKey: any, items: Array<{ k: string; v: any; }>) => {
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
    uniKey && updater.editingValues(filter(editingValues, item => item.uniKey !== uniKey));
  };

  const handleUpdateEditingValues = (uniKey: any, items: Array<{ k: string; v: any; }>) => {
    uniKey && updater.editingValues(editRule(editingValues, uniKey, items));
  };

  const columns = [
    {
      title: textMap.name,
      dataIndex: 'name',
      render: (v: string, { uniKey }: IValue) => (
        <Input
          defaultValue={v}
          onBlur={e => handleUpdateEditingValues(uniKey, [{ k: 'name', v: e.target.value }])}
        />
      ),
    },
    {
      title: textMap.value,
      dataIndex: 'value',
      render: (v: string, { uniKey }: IValue) => (
        <Input
          defaultValue={v}
          onBlur={e => handleUpdateEditingValues(uniKey, [{ k: 'value', v: e.target.value }])}
        />
      ),
    },
    {
      title: textMap.action,
      render: ({ uniKey }: IValue) => <a href="#" onClick={() => handleRemoveEditingValues(uniKey)}>{textMap.delete}</a>,
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
        dataSource={editingValues}
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
      />
    </div>
  );
};

export { KVTable };
