import { strToObject } from '../../../utils';

export function checkFixedData(str: string): boolean {
  // 空的满足校验规则
  if (!str) {
    return true;
  }
  try {
    if (str.indexOf('[') > -1) {
      const fixedData = strToObject(str);
      for (const item of fixedData) {
        const { name, value } = item;
        if (!name || !value) {
          return false;
        }
      }
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
}
