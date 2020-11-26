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
  if (!ObjData) {
    return {};
  }
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

/**
 * 动态插入项到数组
 * @param condition 插入条件
 * @param list 插入项数组
 * @return condition ? list : []
 */
export const insertWhen = <T=any>(condition: boolean, list: T[]): T[] => {
  return condition ? list : [];
};


/**
 * 生成 UUID
 * @param {number} [len]
 * @param {number} [radix]
 * @returns
 */
export const genUUID = (len?: number, radix?: number) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const _radix = radix || chars.length;
  const uuid = [];

  if (len) {
    for (let i = 0; i < len; i++) {
      // eslint-disable-next-line no-bitwise
      uuid[i] = chars[0 | (Math.random() * _radix)];
    }
  } else {
    let r;
    uuid[8] = '-';
    uuid[13] = '-';
    uuid[18] = '-';
    uuid[23] = '-';
    uuid[14] = '4';

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        // eslint-disable-next-line no-bitwise
        r = 0 | (Math.random() * 16);
        // eslint-disable-next-line no-bitwise
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
};
