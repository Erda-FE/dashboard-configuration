import * as React from 'react';
import { get, isPlainObject, map } from 'lodash';
import { DC } from 'src/types';
import DcContainer from '../../DcContainer';
import { getConfig } from '../../../config';

const chartConfigMap = getConfig('chartConfigMap');
const genGridItems = (pureLayout: DC.PureLayoutItem[], viewMap: Record<string, DC.View>, isPure?: boolean) => {
  return map(pureLayout, ({ i, ...others }: any) => {
    let ChildComp = null;
    let view = viewMap[i];
    view = typeof view === 'function' ? (view as Function)() : view;

    if (!view) {
      return null;
    }

    if (isPlainObject(view)) {
      const { chartType = '' } = view;
      const ChartNode = get(chartConfigMap, [chartType, 'Component']) as any;
      const node = ChartNode ? <ChartNode {...view.chartProps} {...view.api} /> : <></>;
      ChildComp = <DcContainer viewId={i} view={view} isPure={isPure}>{node}</DcContainer>;
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
