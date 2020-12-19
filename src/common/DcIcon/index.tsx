import * as React from 'react';
import classnames from 'classnames';

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
    small: size === 'small'
  })
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
