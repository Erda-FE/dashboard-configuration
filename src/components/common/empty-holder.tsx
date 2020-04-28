import React from 'react';
import { Empty } from 'antd';

import './empty-holder.scss';

const EmptyHolder = () => (
  <div className="bi-empty-holder">
    <Empty description=" " />
  </div>
);

export { EmptyHolder };
