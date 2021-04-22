import React, { useState } from 'react';
import { DatePicker } from '@terminus/nusi';
import moment, { Moment } from 'moment';
import { getTimeRanges, getTimeSpan, ITimeSpan } from './utils';

const { RangePicker } = DatePicker;

interface IProps {
  defaultTime?: number | Moment[] | number[];
  disabledDate?: (currentDate?: Moment) => boolean;
  onOk: (v: ITimeSpan) => void;
  [k: string]: any;
}

export default ({ defaultTime, onOk, ...rest }: IProps) => {
  const [value, setValue] = useState<[Moment, Moment]>();

  React.useEffect(() => {
    const { startTimeMs, endTimeMs } = getTimeSpan(defaultTime);
    setValue([moment(startTimeMs), moment(endTimeMs)]);
  }, [defaultTime]);

  const defaultDisabledDate = (current: Moment | undefined) => {
    const endEdge = moment();
    const startEdge = moment().subtract(8, 'days');
    return !!current && (current > endEdge || current < startEdge);
  };

  return (
    <RangePicker
      showTime
      style={{ width: 400 }}
      format="YYYY-MM-DD HH:mm:ss"
      allowClear={false}
      placeholder={['开始于', '结束于']}
      onChange={(v: any) => setValue(v)}
      value={value as any}
      // disabledDate={disabledDate || defaultDisabledDate}
      ranges={getTimeRanges()}
      onOk={(v: any) => onOk(getTimeSpan(v))}
      {...rest}
    />
  );
};
