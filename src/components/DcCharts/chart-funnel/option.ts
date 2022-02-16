import { get, map, merge, set } from 'lodash';
import { getCustomOption } from 'src/components/DcCharts/common/custom-option';
import { getCommonFormatter } from 'src/common/utils';
import getDefaultOption from './default-option';
import DashboardStore from 'src/stores/dash-board';

export function getOption(data: DC.StaticData, config: DC.ChartConfig) {
  const { option: _option = {} } = config || {};
  const option = merge(getDefaultOption(), getCustomOption(data, config));
  const { metricData = [], legendData = [], unit } = data || {};
  const locale = DashboardStore.getState((s) => s.locale);

  if (legendData.length) {
    set(option, ['legend', 'data'], legendData);
  }

  const series = map(metricData, (_data) => ({
    ..._data,
    data: map(_data.data, (x: any) => ({
      ...x,
      name: x?.i18n?.alias?.[locale] || x.name,
    })),
    label: {
      show: true,
      position: 'inside',
    },
    type: 'funnel',
  }));

  return merge(
    option,
    {
      series,
      tooltip: {
        formatter: ({ seriesName, name, value, percent, marker }: any) => {
          return `${seriesName} <br/> ${marker} ${name} : ${getCommonFormatter(unit, value)} (${percent}%)`;
        },
        backgroundColor: 'rgba(48,38,71,0.96)',
        textStyle: {
          color: '#fff',
        },
      },
    },
    _option,
  );
}
