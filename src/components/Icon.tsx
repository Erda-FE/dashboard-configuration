import React from 'react';

interface IProps {
  type: DcIconType;
  className?: string;
  onClick?: (e: any) => void;
}
export const DcIcon = ({ type, className = '', onClick, ...rest }: IProps) => <span className={`dc-iconfont dc-icon-${type} ${className}`} onClick={onClick} {...rest} />;
