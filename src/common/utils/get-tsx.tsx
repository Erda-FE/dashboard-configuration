import * as React from 'react';
import { Tooltip } from '@terminus/nusi';

export function wrapWithTooltip(title: string, children: string, key?: string) {
  const k = key ? { key } : {};
  return (<Tooltip {...k} title={title}>{children}</Tooltip>);
}
