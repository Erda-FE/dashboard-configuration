import { get, map, merge, reduce, set } from 'lodash';
import { getCustomOption } from 'src/components/DcCharts/common/custom-option';
import { getCommonFormatter } from 'src/common/utils';
import getDefaultOption from './default-option';
import DashboardStore from 'src/stores/dash-board';

export function getOption(data: DC.StaticData, config: DC.ChartConfig) {
  const { option: _option = {} } = config || {};
  const option = merge(getDefaultOption(), getCustomOption(data, config));
  const { metricData = [], legendData = [], unit } = data || {};
  const isShowTotal = get(config, ['optionProps', 'isShowTotal']);
  const locale = DashboardStore.getState((s) => s.locale);

  if (legendData.length) {
    set(option, 'legend.data', legendData);
  }

  return merge(
    option,
    {
      series: map(metricData, (item) => {
        return {
          ...item,
          data: map(item.data, (x: any) => ({
            ...x,
            name: x?.i18n?.alias?.[locale] || x?.name || '',
          })),
          type: 'pie',
          radius: isShowTotal ? ['50%', '70%'] : '70%',
        };
      }),
      tooltip: {
        trigger: 'item',
        formatter: (record: any) => {
          const { seriesName, name, value, percent, marker, data } = record;
          const { i18n } = data;
          return `${seriesName} <br/> <span> ${marker}${i18n?.alias?.[locale] ?? name} : ${getCommonFormatter(
            unit,
            value,
          )} (${percent}%) </span>`;
        },
        backgroundColor: 'rgba(48,38,71,0.96)',
        textStyle: {
          color: '#fff',
        },
      },
    },
    isShowTotal
      ? {
          title: {
            text: '总量',
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            subtext: getCommonFormatter(
              unit,
              reduce(get(metricData, [0, 'data']), (sum, { value }) => sum + value, 0),
            ),
            left: 'center',
            top: 'center',
            textStyle: {
              color: '#6c7a89',
              fontSize: 18,
              align: 'center',
            },
            subtextStyle: {
              fontSize: 24,
              verticalAlign: 'bottom',
              color: '#000000',
            },
          },
        }
      : {},
    _option,
  );
}
