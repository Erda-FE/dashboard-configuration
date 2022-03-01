/**
 * 数据指标
 */
import React from 'react';
import { ceil, isNumber, map, uniqueId } from 'lodash';
import ChartEditorStore from 'src/stores/chart-editor';
import { getCommonFormatter } from 'src/common/utils';
import dcRegisterComp from 'src/components/dc-register-comp';
import DashboardStore from 'src/stores/dash-board';
import './index.scss';

interface IResult {
  name?: string;
  unit?: string;
  value?: number | string;
  status?: string;
  color?: string;
  i18n?: {
    alias: {
      zh: string;
      en: string;
    };
  };
}

interface IProps {
  viewId: string;
  results: IResult[];
}

const Metric = ({ results = [], viewId }: IProps) => {
  const locale = DashboardStore.getState((s) => s.locale);
  return (
    <React.Fragment>
      <section className="dc-metric-panel">
        {map(results, ({ name, i18n, value, unit, color }) => (
          <div className="dc-metric-item" key={uniqueId(viewId)}>
            <span className={`dc-metric-value ${color ? `color-${color}` : ''}`}>
              {`${isNumber(value) ? getCommonFormatter(unit, ceil(value, 2)) : value || '--'}`}
            </span>
            <span className="dc-metric-name">{i18n?.alias?.[locale] ?? name}</span>
          </div>
        ))}
      </section>
    </React.Fragment>
  );
};

export default ({ data: { metricData: results, proportion }, option, ...rest }: any) => {
  const viewMap = ChartEditorStore.useStore((s) => s.viewMap);
  const { Comp } = dcRegisterComp.getComp<(props: IProps) => JSX.Element>('card', Metric);
  const drawerInfo = viewMap[rest.viewId] || {};
  const props = {
    chartType: drawerInfo.chartType as string,
    results,
    option: { ...option, proportion },
  };
  return <Comp {...props} {...rest} />;
};
