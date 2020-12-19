import { merge, set, map, max, min } from 'lodash';
import { getCustomOption } from '../common/custom-option';
import getDefaultOption from './default-option';

export const getOption = (data: DC.StaticData, config: DC.ChartConfig, mapType: string) => {
  const option = merge(getDefaultOption(), getCustomOption(data, config));
  const { metricData = [], legendData = [] } = data;

  if (legendData.length) {
    set(option, ['legend', 'data'], legendData);
  }

  let minVal = 0;
  let maxVal = 1;

  const series = map(metricData, (_data) => {
    const val = map(_data.data, (item) => item?.value);
    min(val) && (minVal = min(val));
    max(val) && (maxVal = max(val) + 1);
    return {
      ..._data,
      type: 'map',
      mapType,
      zoom: 1.2,
      roam: true, // 是否开启平游或缩放
      scaleLimit: { // 滚轮缩放的极限控制
        min: 1,
        max: 2,
      },
      itemStyle: {
        areaColor: '#f5f5f6',
        borderColor: '#cdced1',
      },
    };
  });

  return merge(option, { series }, { visualMap: { min: minVal, max: maxVal } });
};
