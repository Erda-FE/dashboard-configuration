import React from 'react';
import { Tooltip } from 'antd';

interface ICutOptions {
  suffix?: string;
  showTip?: boolean;
}

/**
 * 截取字符串
 * @param fullStr 字符串
 * @param limit 长度限制
 * @param options {ICutOptions} 是否超过长度后显示提示
 */
export function cutStr(fullStr: string, limit = 0, options?: ICutOptions) {
  if (typeof fullStr !== 'string') {
    return '';
  }
  const { suffix = '...', showTip = false } = options || {};
  const str = fullStr.length > limit ? `${fullStr.substring(0, limit)}${suffix}` : fullStr;
  const sameLength = fullStr.length === str.length;
  return showTip && !sameLength ? <Tooltip title={fullStr}>{str}</Tooltip> : str;
}
