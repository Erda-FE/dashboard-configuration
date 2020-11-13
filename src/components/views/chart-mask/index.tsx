import './index.scss';
import { Spin } from 'antd';
import React from 'react';

interface IProps {
  message?: string;
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

export const ChartSpinMask = ({ message }: IProps) => <div className="dc-chart-mask"><Spin tip={message} /></div>;

export default ChartMask;
