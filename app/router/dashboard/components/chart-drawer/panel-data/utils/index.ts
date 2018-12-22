import { getMockLine } from 'dashboard/components/chart-line/utils';
import { mockDataPie } from 'dashboard/components/chart-pie/utils';

export const getMockData = (chartType: string) => {
  switch (chartType) {
    case 'line':
    case 'bar':
    case 'area':
      return getMockLine(chartType);
    case 'pie':
      return mockDataPie;
    default:
      return {};
  }
};
