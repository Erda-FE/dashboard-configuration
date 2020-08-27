import React from 'react';
import { Empty } from 'antd';

import './empty-holder.scss';

const EmptyHolder = () => (
  <div className="dc-empty">
    <Empty description=" " />
  </div>
);

export { EmptyHolder };
