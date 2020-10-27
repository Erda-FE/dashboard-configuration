import { merge, set, map } from 'lodash';
import { getCustomOption } from '../common/custom-option';
import defaultOption from './default-option';

export const getOption = (data: DC.StaticData, config: DC.ChartConfig, mapType: string) => {
  const option = merge(defaultOption, getCustomOption(data, config));
  const { metricData, legendData = [] } = data;

  if (legendData.length) {
    set(option, ['legend', 'data'], legendData);
  }

  const series = map(metricData, _data => ({
    type: 'map',
    mapType,
    // 关闭拖拽
    roam: false,
    ..._data,
  }));

  return merge(option, { series });
};
