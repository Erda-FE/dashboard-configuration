import * as React from 'react';
import classnames from 'classnames';
import { Tooltip } from '@terminus/nusi';

import './index.scss';

interface IProps {
  type: DcIconType;
  size?: 'small' | 'default';
  className?: string;
  onClick?: (e: any) => void;
}

export const DcIcon = ({
  type,
  size = 'default',
  className,
  onClick,
  ...rest
}: IProps) => {
  let _classNames = classnames({
    'dc-iconfont': true,
    [`dc-icon-${type}`]: true,
    small: size === 'small',
  });
  if (className) {
    _classNames = `${_classNames} ${className}`;
  }

  return (
    <span
      className={_classNames}
      onClick={onClick}
      {...rest}
    />
  );
};

export const DcInfoIcon = ({
  info,
  size,
}: {
  info: string;
  size?: 'small' | 'default';
}) => {
  return (
    <Tooltip title={info}>
      <DcIcon className="mr4" size={size} type="info-circle" />
    </Tooltip>
  );
};
