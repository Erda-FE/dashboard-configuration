import * as React from 'react';
import classnames from 'classnames';
import { Choose, When, Otherwise } from 'tsx-control-statements/components';
import { Tooltip } from '@terminus/nusi';

import '../../static/iconfont.js';
import './index.scss';

interface IProps {
  useSymbol?: boolean;
  type: DcIconType;
  size?: 'small' | 'default';
  className?: string;
  onClick?: (e: any) => void;
}

export const DcIcon = ({
  useSymbol = false,
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
    <Choose>
      <When condition={useSymbol}>
        <svg className="dc-iconfont dc-symbol-iconfont" aria-hidden="true">
          <use xlinkHref={`#dc-icon-${type}`} />
        </svg>
      </When>
      <Otherwise>
        <span
          className={_classNames}
          onClick={onClick}
          {...rest}
        />
      </Otherwise>
    </Choose>
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
