import agent from '../utils/agent';

export const getChartData = ({ url, query }: { url: string; query?: any }) => (
  agent.get(url)
    .query(query)
    .then((response: any) => response.body)
);
