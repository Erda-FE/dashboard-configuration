import * as React from 'react';
import { Table, Input, Button } from 'antd';
import { useMount } from 'react-use';
import { uniqueId, isEmpty, map, filter, fill, cloneDeep, find, findIndex, reduce, omit } from 'lodash';
import { useUpdate } from '../common';
import DashboardStore from '../stores/dash-board';
import './kv-table.scss';

interface IProps {
  forwardedRef: React.Ref<any>
  value?: DC.IKVTableValue[]
  onChange(values: Array<DC.IKVTableValue>): void
}

const KVTable = (props: IProps) => {
  const { value, onChange } = props;
  const textMap = DashboardStore.useStore(s => s.textMap);

  const [{ editingValues }, updater] = useUpdate({
    editingValues: [],
  });

  // React.useEffect(() => {
  //   updater.editingValues(map(value, item => ({ ...item, uniKey: uniqueId() })));
  // }, [value, updater]);

  useMount(() => {
    updater.editingValues(map(value, item => ({ ...item, uniKey: uniqueId() })));
  });

  React.useEffect(() => {
    const validVal = filter(editingValues, item => item.name && item.value);
    !isEmpty(validVal) && onChange(map(validVal, item => omit(item, 'uniKey')));
  }, [editingValues, onChange]);

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
      render: (v: string, { uniKey }: DC.IKVTableValue) => (
        <Input
          defaultValue={v}
          onBlur={e => handleUpdateEditingValues(uniKey, [{ k: 'name', v: e.target.value }])}
        />
      ),
    },
    {
      title: textMap.value,
      dataIndex: 'value',
      render: (v: string, { uniKey }: DC.IKVTableValue) => (
        <Input
          defaultValue={v}
          onBlur={e => handleUpdateEditingValues(uniKey, [{ k: 'value', v: e.target.value }])}
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
        dataSource={editingValues}
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
