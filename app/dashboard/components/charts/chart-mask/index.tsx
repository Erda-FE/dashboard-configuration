
import React from 'react';
import './index.scss';

interface IProps {
  isMock?: boolean
}

const ChartMask = ({ isMock = false }: IProps) => {
  if (!isMock) return null;
  return (
    <div className="bi-chart-mask">
      <div className="bi-mask-inner" />
      <div className="bi-mask-text">模拟数据展示</div>
    </div>
  );
};

export default ChartMask;
