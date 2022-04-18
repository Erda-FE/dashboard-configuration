import React from 'react';
import { Tooltip } from 'antd';

export function wrapWithTooltip(title: string, children: string, key?: string) {
  const k = key ? { key } : {};
  return (
    <Tooltip {...k} title={title}>
      {children}
    </Tooltip>
  );
}
