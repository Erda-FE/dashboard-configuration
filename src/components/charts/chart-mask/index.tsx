import './index.scss';

import React from 'react';

interface IProps {
  message?: string
}

const ChartMask = ({ message }: IProps) => {
  if (!message) {
    return null;
  }
  // if (message) {
  //   return (
  //     <div className="bi-chart-mask">
  //       <div className="bi-mask-inner-message" />
  //       <div className="bi-mask-message">{message || 模拟数据展示}</div>
  //     </div>
  //   );
  // }
  return (
    <div className="bi-chart-mask">
      <div className="bi-mask-inner" />
      <div className="bi-mask-text">{message}</div>
    </div>
  );
};

export default ChartMask;
