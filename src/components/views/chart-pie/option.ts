import { merge, set } from 'lodash';
import { getCustomOption } from '../common/custom-option';
import getDefaultOption from './default-option';

export function getOption(data: DC.StaticData, config: DC.ChartConfig) {
  const option = merge(getDefaultOption(), getCustomOption(data, config));
  const { metricData = [], legendData = [] } = data || {};

  if (legendData.length) {
    set(option, ['legend', 'data'], legendData);
  }

  return merge(option, { series: metricData });
}
