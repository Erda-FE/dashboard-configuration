import { wrapWithTooltip } from './get-tsx';
import { get, pick } from 'lodash';

export { getFormatter } from './formatter';
interface ICutOptions {
  suffix?: string;
  showTip?: boolean;
}

export function cutStr(fullStr: string, limit = 0, options?: ICutOptions) {
  if (typeof fullStr !== 'string') {
    return '';
  }
  const { suffix = '...', showTip = false } = options || {};
  const str = (fullStr.length > limit ? `${fullStr.substring(0, limit)}${suffix}` : fullStr);
  const sameLength = fullStr.length === str.length;
  return showTip && !sameLength ? wrapWithTooltip(fullStr, str) : str;
}

/**
 * used to filter out empty fields and collect fields as object
 * input -> { legend: { align: 'left', bottom: 10 }, tooltip: { text: '', style: undefined, formatter: { show: true } }}
 * output -> { 'legend.align': 'left', 'legend.bottom': 10, 'tooltip.text': '', 'tooltip.formatter.show': true }
 * @param ObjData
 */
export const collectFields = (ObjData: any) => {
  const filledFields: string[] = [];
  const findData = (obj: any, parentArray: string[]) => {
    Object.keys(obj).forEach((key) => {
      const currentParent = [...parentArray, key];
      const value = get(obj, key);
      if (typeof value === 'object') {
        findData(value, currentParent);
      } else if (value || value === 0 || value === '') {
        filledFields.push(currentParent.join('.'));
      }
    });
  };
  findData(ObjData, []);
  return pick(ObjData, filledFields);
};
