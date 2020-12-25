import * as React from 'react';
import { Tooltip } from '@terminus/nusi';
import { DcIcon } from '..';

interface IProps {
  text: string;
  info: string;
  size?: 'default' | 'small';
}

export const DcInfoLabel = ({ text, info, size }: IProps) => {
  return (
    <div className="flex-box">
      <span className="mr4">{text}</span>
      <Tooltip title={info}>
        <DcIcon type="question-circle" size={size} />
      </Tooltip>
    </div>
  );
};
