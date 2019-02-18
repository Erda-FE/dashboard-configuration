
import React from 'react';
import './index.scss';

interface IProps {
  isMock?: boolean
  message?: string
}

const ChartMask = ({ isMock = false, message }: IProps) => {
  if (message) {
    return (
      <div className="bi-chart-mask">
        <div className="bi-mask-inner-message" />
        <div className="bi-mask-message">{message}</div>
      </div>
    );
  } else if (!isMock) {
    return null;
  }
  return (
    <div className="bi-chart-mask">
      <div className="bi-mask-inner" />
      <div className="bi-mask-text">模拟数据展示</div>
    </div>
  );
};

export default ChartMask;
