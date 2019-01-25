
import React from 'react';
import './index.scss';

interface IProps {
  isMock?: boolean
  maskContent?: string
}

const ChartMask = ({ isMock = false, maskContent = '模拟数据展示' }: IProps) => {
  if (!isMock) return null;
  return (
    <div className="bi-chart-mask">
      <div className="bi-mask-inner" />
      <div className="bi-mask-text">{maskContent}</div>
    </div>
  );
};

export default ChartMask;
