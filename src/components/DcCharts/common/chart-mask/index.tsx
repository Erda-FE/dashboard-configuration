import { Spin } from '@terminus/nusi';
import React from 'react';

import './index.scss';

interface IProps {
  message?: string | Element;
}

const ChartMask = ({ message }: IProps) => {
  if (!message) {
    return null;
  }

  return (
    <div className="dc-chart-mask">
      <div className="dc-chart-mask-message">{message}</div>
    </div>
  );
};

export const ChartSpinMask = ({ message }: IProps) => (
  <div className="dc-chart-mask">
    <Spin tip={message as string} />
  </div>
);

export default ChartMask;
