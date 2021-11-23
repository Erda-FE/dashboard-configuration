import { get, map, merge, reduce, set } from 'lodash';
import { getCustomOption } from 'src/components/DcCharts/common/custom-option';
import { getCommonFormatter } from 'src/common/utils';
import getDefaultOption from './default-option';

export function getOption(data: DC.StaticData, config: DC.ChartConfig) {
  const { option: _option = {} } = config || {};
  const option = merge(getDefaultOption(), getCustomOption(data, config));
  const { metricData = [], legendData = [], unit } = data || {};
  const isShowTotal = get(config, ['optionProps', 'isShowTotal']);

  if (legendData.length) {
    set(option, 'legend.data', legendData);
  }

  return merge(
    option,
    {
      series: map(metricData, (item) => ({
        ...item,
        type: 'pie',
        radius: isShowTotal ? ['50%', '70%'] : '70%',
      })),
      tooltip: {
        trigger: 'item',
        formatter: ({ seriesName, name, value, percent }: any) =>
          `${seriesName} <br/>${name} : ${getCommonFormatter(unit, value)} (${percent}%)`,
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
