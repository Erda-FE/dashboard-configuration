import * as React from 'react';
import { Modal, Tabs } from '@terminus/nusi';
import DashboardStore from '../../stores/dash-board';
import GlobalFiltersStore from '../../stores/global-filters';

const textMap = DashboardStore.getState((s) => s.textMap);

const TabPaneOptionsName = ({ name }: { name: string }) => {
  return (
    <div className="flex-box">
      <span className="flex-1">{name}</span>

    </div>
  );
};

export const ConfigGlobalFiltersModal = () => {
  const [visible] = GlobalFiltersStore.useStore((s) => [s.configModalVisible]);
  const { s } = GlobalFiltersStore;
  const { toggleConfigModal } = GlobalFiltersStore;
  const a: DICE_DATA_CONFIGURATOR;

  return (
    <Modal
      visible
      title={textMap['global filter']}
      width={800}
      onCancel={() => toggleConfigModal(false)}
    >
      <div className="dc-filters-configs-list">
        <Tabs
          defaultActiveKey="time"
          tabPosition="left"
        >
          <Tabs.TabPane tab={textMap['time filter']} key="time" />
          <Tabs.TabPane tab="Tab 1" key="2">Content of tab 1</Tabs.TabPane>
          <Tabs.TabPane tab="Tab 1" key="3">Content of tab 1</Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};
