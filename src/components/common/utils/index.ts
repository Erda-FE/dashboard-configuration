import { wrapWithTooltip } from './get-tsx';

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

