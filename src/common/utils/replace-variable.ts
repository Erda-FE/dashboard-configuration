import produce from 'immer';
import { isEmpty } from 'lodash';

/**
 *替换字符串或对象中的 {{}} 为指定的变量
 *
 * @param {*} source
 * @param {Record<string, any>} variable
 * @returns {*}
 */
function replaceVariable(source: any, variable?: Record<string, any>): any {
  if (!variable || isEmpty(variable)) return source;
  const replaceReg = /\{\{.*?\}\}/g;
  const type = typeof source;
  if (type === 'string') {
    const matchItems = source.match(replaceReg);
    if (!matchItems?.length) return source;
    return matchItems.reduce((acc: string, current: string) => {
      let val;
      if (variable[current.slice(2, -2)] === 0) {
        val = 0;
      } else {
        val = variable[current.slice(2, -2)]
        || (source.length > current.length ? '' : undefined);
      }
      return (val || val === '' || val === 0) ? acc.replace(current, val) : undefined;
    }, source);
  } else if (type != null && type === 'object') {
    const result = produce(source, (draft: { [x: string]: any }) => {
      for (const key in draft) {
        if (Object.prototype.hasOwnProperty.call(draft, key)) {
          draft[key] = replaceVariable(draft[key], variable);
        }
      }
    });
    return result;
  } else {
    return source;
  }
}

export { replaceVariable };
