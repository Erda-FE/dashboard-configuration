import { merge, set } from 'lodash';
import { getCustomOption } from '../common/custom-option';
import defaultOption from './default-option';

export const getOption = (data: DC.StaticData, config: DC.ChartConfig, mapType: string) => {
  const option = merge(defaultOption, getCustomOption(data, config));
  const { metricData = [], legendData = [] } = data || {};

  if (legendData.length) {
    set(option, ['legend', 'data'], legendData);
  }

  const series = [
    {
      name: 'test',
      type: 'map',
      mapType,
      // 关闭拖拽
      roam: false,
      data: metricData,
    },
  ];

  return merge(option, { series });
};
