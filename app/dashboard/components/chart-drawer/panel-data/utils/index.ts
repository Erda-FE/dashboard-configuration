import { mockDataLine } from '../../../chart-line/utils';
import { mockDataPie } from '../../../chart-pie/utils';

export const getMockData = (chartType: string) => {
  switch (chartType) {
    case 'line':
    case 'bar':
    case 'area':
      return mockDataLine;
    case 'pie':
      return mockDataPie;
    default:
      return {};
  }
};
