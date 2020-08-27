import './index.scss';

import React from 'react';

interface IProps {
  message?: string
}

const ChartMask = ({ message }: IProps) => {
  if (!message) {
    return null;
  }

  return (
    <div className="dc-chart-mask">
      <div className="dc-mask-message">{message}</div>
    </div>
  );
};

export default ChartMask;
