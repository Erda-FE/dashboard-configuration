import { merge, set, map, get } from 'lodash';
import { getCustomOption } from '../common/custom-option';
import getDefaultOption from './default-option';

export function getOption(data: DC.StaticData, config: DC.ChartConfig) {
  const option = merge(getDefaultOption(), getCustomOption(data, config));
  const { metricData = [], legendData = [] } = data || {};
  const unit = get(config, ['optionProps', 'unit']);

  if (legendData.length) {
    set(option, ['legend', 'data'], legendData);
  }

  const series = map(metricData, (_data) => ({
    ..._data,
    label: {
      show: true,
      position: 'inside',
    },
    type: 'funnel',
  }));

  return merge(option, { series, tooltip: { formatter: `{a} <br/>{b} : {c}${unit || '%'}` } });
}
