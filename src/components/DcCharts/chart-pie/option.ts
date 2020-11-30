import { merge, set, reduce, get, map } from 'lodash';
import { getCustomOption } from '../common/custom-option';
import getDefaultOption from './default-option';

export function getOption(data: DC.StaticData, config: DC.ChartConfig) {
  const option = merge(getDefaultOption(), getCustomOption(data, config));
  const { metricData = [], legendData = [] } = data || {};
  const isShowTotal = get(config, ['optionProps', 'isShowTotal']);

  if (legendData.length) {
    set(option, ['legend', 'data'], legendData);
  }

  console.log(metricData);
  return merge(
    option,
    {
      series: map(metricData, (item) => ({
        ...item,
        type: 'pie',
        radius: isShowTotal ? ['50%', '70%'] : undefined,
      })),
    },
    isShowTotal ? {
      title: {
        text: '总量',
        subtext: `${reduce(get(metricData, [0, 'data']), (sum, { value }) => (sum + value), 0)}`,
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
    } : {},
  );
}
