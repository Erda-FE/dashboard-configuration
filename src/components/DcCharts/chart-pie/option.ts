import { merge, set, reduce, get } from 'lodash';
import { getCustomOption } from '../common/custom-option';
import getDefaultOption from './default-option';

export function getOption(data: DC.StaticData, config: DC.ChartConfig) {
  const option = merge(getDefaultOption(), getCustomOption(data, config));
  const { metricData = [], legendData = [] } = data || {};
  const isShowTotal = get(config, ['optionProps', 'isShowTotal']);

  if (legendData.length) {
    set(option, ['legend', 'data'], legendData);
  }

  return merge(
    option,
    { series: metricData },
    isShowTotal ? {
      title: {
        text: '总量',
        subtext: `${reduce(get(metricData, [0, 'data']), (sum, { value }) => (sum + value), 0)}`,
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#6c7a89',
          fontSize: 24,
          align: 'center',
        },
        subtextStyle: {
          fontSize: 16,
          color: '#27D9C8',
        },
      },
      series: [{
        radius: ['50%', '70%'],
      }],
    } : {},
  );
}
