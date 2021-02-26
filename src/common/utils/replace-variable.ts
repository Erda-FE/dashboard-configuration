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
    const matches = source.match(replaceReg);
    if (!matches?.length) return source;
    let result;
    for (let index = 0; index < matches.length; index++) {
      const val = variable[matches[index].slice(2, -2)];
      result = val ? source.replace(replaceReg, val) : undefined;
    }
    return result;
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
