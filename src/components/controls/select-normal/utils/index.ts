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

export function plainArrayValidator(_rule: any, text: string, callback: any): void {
  if (!text) {
    callback();
    return;
  }
  try {
    const arrayData = strToObject(text);
    if (Array.isArray(arrayData) && arrayData.every(x => typeof x === 'string')) {
      callback();
      return;
    }
    callback('请输入正确的字符串数组');
  } catch (e) {
    callback('请输入正确的字符串数组');
  }
}

export function strToObject(str: string) {
  // eslint-disable-next-line
  return  (new Function(`return ${str}`))();
}
