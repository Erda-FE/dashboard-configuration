import React from 'react';

const ChartMask = (isMock: boolean) => {
  if (isMock) {
    return (
      <React.Fragment>
        <div className="bi-chart-mask">
          <div className="bi-mask-inner" />
          <div className="bi-mask-text">模拟数据展示</div>
        </div>
      </React.Fragment>
    );
  }
  return null;
};

export default ChartMask;
