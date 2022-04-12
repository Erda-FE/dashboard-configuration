import { findIndex } from 'lodash';

class Formatter {
  toFixed(value: number, fixed = 2): string | number {
    let fixValue = Number(value).toFixed(fixed);
    if (parseFloat(fixValue) === 0 && value > 0) {
      // fix之后值为0,改为科学计数 进制
      const reFix = Math.floor(Math.log(value) / Math.LN10);
      const hex = 10 ** -reFix;
      fixValue = (value * hex).toFixed(1);
      return `${fixValue}e${reFix}`;
    }
    return /\.(0)+$/.test(fixValue) ? `${parseInt(fixValue, 10)}` : fixValue;
  }

  format(value: number, fixed?: number): string | number {
    return this.toFixed(value, fixed);
  }
}

class PercentFormatter extends Formatter {
  format(value: number, fixed = 2) {
    return `${this.toFixed(value, fixed)} %`;
  }
}

class AryFormatter extends Formatter {
  aryTower: string[];
  ary: number;

  format(value: number, fixed?: number) {
    const { ary, aryTower } = this;
    if (value === 0) {
      return `${this.toFixed(value, fixed)} ${aryTower[0]}`;
    }
    if (ary && aryTower && value > 0) {
      let power = Math.floor(Math.log(value) / Math.log(ary));
      power = power < aryTower.length ? power : aryTower.length - 1;
      power = power > 0 ? power : 0;
      const hex = ary ** power;
      const displayValue = this.toFixed(value / hex, fixed);
      return `${displayValue} ${aryTower[power]}`;
    }
    return value;
  }

  getCurAryTower(aryTower: string[], unit: string) {
    let idx = 0;
    if (unit) {
      idx = findIndex(aryTower, (v) => v.toLocaleUpperCase() === unit.toLocaleUpperCase());
      idx < 0 && (idx = 0);
    }
    return aryTower.slice(idx || 0);
  }
}

class NumberFormatter extends AryFormatter {
  constructor(unit: string) {
    super();
    this.aryTower = this.getCurAryTower(['', 'K', 'M'], unit);
    this.ary = 1000;
  }
}

class CapacityFormatter extends AryFormatter {
  constructor(unit: string) {
    super();
    const allAryTower = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    this.aryTower = this.getCurAryTower(allAryTower, unit);
    this.ary = 1024;
  }
}

class StorageFormatter extends AryFormatter {
  constructor(unit: string) {
    super();
    const allAryTower = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    this.aryTower = this.getCurAryTower(allAryTower, unit);
    this.ary = 1024;
  }
}

class TrafficFormatter extends AryFormatter {
  constructor(unit: string) {
    super();
    const allAryTower = ['B/S', 'KB/S', 'MB/S', 'GB/S', 'TB/S', 'PB/S', 'EB/S', 'ZB/S', 'YB/S'];
    this.aryTower = this.getCurAryTower(allAryTower, unit);
    this.ary = 1024;
  }
}

class TimeFormatter extends AryFormatter {
  constructor(unit: string) {
    super();
    const allAryTower = ['ns', 'μs', 'ms', 's'];
    this.aryTower = this.getCurAryTower(allAryTower, unit || 'ms');
    this.ary = 1000;
  }
}

class OwnUnit extends Formatter {
  unit: string;

  constructor(unit: string) {
    super();
    this.unit = unit || '';
  }

  format(value: number, fixed = 2) {
    return `${this.toFixed(value, fixed)} ${this.unit}`;
  }
}

const MonitorChartFormatterMap = (unitType: string, unit: string) => {
  const formatterMap = {
    NUMBER: new NumberFormatter(unit),
    PERCENT: new PercentFormatter(),
    CAPACITY: new CapacityFormatter(unit),
    TRAFFIC: new TrafficFormatter(unit),
    TIME: new TimeFormatter(unit),
    STORAGE: new StorageFormatter(unit),
  };
  if (!formatterMap[unitType] && unit) {
    // 有自身单位且不需要转换数据的，如unit= 次/s
    return new OwnUnit(unit);
  }
  return formatterMap[(unitType || '').toLocaleUpperCase()];
};

export const getFormatter = (unitType: string, unit: string): AryFormatter =>
  MonitorChartFormatterMap(unitType, unit) || new NumberFormatter(unit);

export const getCommonFormatter = (_unit: { type: string; unit: string } | undefined, _val: number) => {
  return !_unit || !_unit?.type || !_unit?.unit ? _val : getFormatter(_unit.type, _unit.unit).format(_val, 2);
};

export const getPrettyFixed = (value: string | number, fixed = 2) => {
  const fixValue = Number(value).toFixed(fixed);
  return /\.(0)+$/.test(fixValue) ? `${parseInt(fixValue, 10)}` : fixValue;
};
