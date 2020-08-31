import React from 'react';
import { isPlainObject, get } from 'lodash';

export const ViewItem = ({ view }: ILayoutItem) => {
  const [dashboardLayout, isEditMode, textMap, chartConfigMap] = DashboardStore.useStore(s => [s.layout, s.isEditMode, s.textMap, s.chartConfigMap]);

  let Comp = null;
  view = typeof view === 'function'
    ? view({ isEditMode, isFullscreen: screenfull.isFullscreen })
    : view;
  if (!view) {
    return null;
  }
  if (isPlainObject(view)) {
    const { chartType = '', customRender } = view;
    const ChartNode = get(chartConfigMap, [chartType, 'Component']);
    Comp = (
      <React.Fragment>
        <ViewOperation viewId={i} view={view} expandOption={expandOption}>
          {
            typeof customRender === 'function'
              ? <CustomNode render={customRender} ChartNode={ChartNode} view={view} />
              : <ChartNode {...view.chartProps} />
          }
        </ViewOperation>
      </React.Fragment>
    );
  } else {
    console.error('layout view should be object or function');
  }
  return Comp;
}
