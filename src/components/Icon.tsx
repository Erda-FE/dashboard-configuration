import React from 'react';

interface IProps {
  type: DcIconType
  onClick?(e: any): void
}
export const DcIcon = ({ type, onClick }: IProps) => {
  return <span className={`dc-iconfont dc-icon-${type}`} onClick={onClick} ></span>
}
