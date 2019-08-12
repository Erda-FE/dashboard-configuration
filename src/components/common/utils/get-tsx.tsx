import * as React from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';

export function wrapWithTooltip(title: string, children: string, key?: string) {
  const k = key ? { key } : {};
  return (<Tooltip {...k} title={title}>{children}</Tooltip>);
}

export function wrapFromNow(time: string, config: {prefix?: string} = {}) {
  const { prefix = '' } = config;
  return (
    <Tooltip title={`${prefix}${moment(time).format('YYYY-MM-DD HH:mm:ss')}`}>
      {moment(time).fromNow()}
    </Tooltip>
  );
}
