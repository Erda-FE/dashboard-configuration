import { mockDataLine } from '../../../chart-line/utils';
import { mockDataPie } from '../../../chart-pie/utils';
import { mockDataCards } from '../../../chart-cards/utils';

export const getMockData = (chartType: string) => {
  switch (chartType) {
    case 'line':
    case 'bar':
    case 'area':
      return mockDataLine;
    case 'pie':
      return mockDataPie;
    case 'cards':
      return mockDataCards;
    default:
      return {};
  }
};
