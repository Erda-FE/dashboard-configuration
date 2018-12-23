import React from 'react';
import classNames from 'classnames';

interface IProps {
  type: string,
  className?: string,
  style?: React.CSSProperties,
  onClick?: React.MouseEventHandler,
}
export default ({ type, className, style, onClick, ...others }: IProps) => {
  const classes = classNames(
    'iconfont',
    `icon-${type}`,
    className
  );

  return <i className={classes} style={style} onClick={onClick} {...others} />;
};
