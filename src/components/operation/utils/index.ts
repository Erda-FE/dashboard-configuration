import { get, find } from 'lodash';

// 从2级对象中获取对应的参数名称、和触发图表id
export const getKeyValue = (temp: any, chartId: string) => {
  let paramName = '';
  let clickId = '';
  find(temp, (value: object, key: string) => {
    const tempName = get(value, chartId, '');
    if (tempName) {
      clickId = key;
      paramName = tempName;
    }
    return tempName;
  });
  return { paramName, clickId };
};
