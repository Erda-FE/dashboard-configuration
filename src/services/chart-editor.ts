import { DC } from 'src/types';
import agent from '../common/utils/agent';

export const getChartData = ({ url, query, method = 'get', body }: DC.API) => (
  agent[method.toLowerCase()](url)
    .query(query)
    .send(body)
    .then((response: any) => response.body)
);

interface IExportChartDataQuery {
  start: number;
  end: number;
  scope: string;
  scopeId: string;
}

interface IExportChartDataPayload {
  select: Array<{
    expr: string;
  }>;
  from: string[];
  limit: number;
}

// 临时加个导出图表数据的 service，后续要支持配置
export const exportChartData = (metric: string, query: IExportChartDataQuery, payload: IExportChartDataPayload) => {
  return agent.post(`/api/metrics/${metric}/export`)
    .responseType('blob')
    .query(query)
    .send(payload)
    // return blob stream
    .then((res: any) => res.body);
};
