/**
 * 判断字符串是否是json
 * @param str 待校验字符串
 * @param strict true: 必须是标准json才可以通过校验，false：js对象也可以通过校验
 */
export function checkJSON(str: string, strict: boolean = false): boolean {
  if (typeof str !== 'string') {
    return false;
  }

  // 标准json
  if (strict) {
    try {
      JSON.parse(str);
      // 排除 JSON.parse('123') => 123 JSON.parse(true) => true
      if (str.indexOf('{') > -1 || str.indexOf('[') > -1) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  try {
    /* eslint-disable */
    (new Function(`return ${str}`))();
    if (str.indexOf('{') > -1 || str.indexOf('[') > -1) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}
