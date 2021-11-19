import moment, { Moment } from 'moment';
import { isArray } from 'lodash';

export interface ITimeSpan {
  hours?: number;
  seconds?: number;
  endTime?: number;
  startTime?: number;
  endTimeMs: number;
  startTimeMs: number;
  endTimeNs?: number;
  startTimeNs?: number;
  time?: { startTime: number; endTime: number };
  timeMs?: { startTimeMs: number; endTimeMs: number };
  timeNs?: { startTimeNs: number; endTimeNs: number };
}

/**
 * 格式化时间，默认为YYYY-MM-DD
 * @param time 传入moment的时间
 * @param format 提示前缀
 */
export const formatTime = (time: string | number, format?: string) =>
  time ? moment(time).format(format || 'YYYY-MM-DD') : null;

/**
 * 获取快捷时间选项
 *
 * @returns
 */
export const getTimeRanges = () => {
  const now = moment();
  return {
    '1小时': [moment().subtract(1, 'hours'), now],
    '3小时': [moment().subtract(3, 'hours'), now],
    '6小时': [moment().subtract(6, 'hours'), now],
    '12小时': [moment().subtract(12, 'hours'), now],
    '1天': [moment().subtract(1, 'days'), now],
    '3天': [moment().subtract(3, 'days'), now],
    '7天': [moment().subtract(7, 'days'), now],
  } as any;
};

export const getTimeSpan = (time?: number | Moment[] | number[]): ITimeSpan => {
  const defaultTime = 1; // 默认取一小时
  let hours = defaultTime;
  let endTimeMs;
  let startTimeMs;

  if (isArray(time)) {
    [startTimeMs, endTimeMs] = time;
    if (moment.isMoment(startTimeMs)) {
      // moment对象
      endTimeMs = moment(endTimeMs).valueOf();
      startTimeMs = moment(startTimeMs).valueOf();
    }
    // hours = (Number(endTimeMs) - Number(startTimeMs)) / 3600000;
  } else {
    hours = time || defaultTime;
    endTimeMs = new Date().getTime();
    startTimeMs = endTimeMs - 3600000 * hours;
  }
  const endTime = parseInt(`${(endTimeMs as number) / 1000}`, 10);
  const startTime = parseInt(`${startTimeMs / 1000}`, 10);
  const endTimeNs = (endTimeMs as number) * 1000000;
  const startTimeNs = startTimeMs * 1000000;

  return {
    hours,
    seconds: Math.ceil(endTime - startTime),
    endTime,
    startTime,
    endTimeMs,
    startTimeMs,
    endTimeNs,
    startTimeNs,
    time: { startTime, endTime },
    timeMs: { startTimeMs, endTimeMs },
    timeNs: { startTimeNs, endTimeNs },
  };
};
