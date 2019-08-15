import React from 'react';
import { Empty } from 'antd';

import './empty-holder.scss';

const EmptyHolder = () => (
  <div className="empty-holder">
    <Empty description="暂无数据" />
  </div>
);

export { EmptyHolder };
