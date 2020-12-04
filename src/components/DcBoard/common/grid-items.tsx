import * as React from 'react';
import { get, isPlainObject } from 'lodash';
import DcContainer from '../../DcContainer';
import { getConfig } from '../../../config';

const chartConfigMap = getConfig('chartConfigMap');
const genGridItems = (pureLayout: DC.PureLayoutItem[], viewMap: Record<string, DC.View>) => {
  return pureLayout.map(({ i, ...others }: any) => {
    let ChildComp = null;
    let view = viewMap[i];
    view = typeof view === 'function' ? view() : view;

    if (!view) {
      return null;
    }

    if (isPlainObject(view)) {
      const { chartType = '' } = view;
      const ChartNode = get(chartConfigMap, [chartType, 'Component']) as any;
      const node = ChartNode ? <ChartNode {...view.chartProps} /> : <></>;
      // grid 和 pureGrid 使用的 DcContainer 需要解耦
      ChildComp = <DcContainer viewId={i} view={view}>{node}</DcContainer>;
    } else {
      // eslint-disable-next-line no-console
      console.error('layout view should be object or function');
    }

    // 因ReactGridLayout内部实现原因，必须有data-grid，否则新增的图表大小会错乱
    return (
      <div key={i} data-grid={{ ...others }}>
        {ChildComp}
      </div>
    );
  });
};

export default genGridItems;
