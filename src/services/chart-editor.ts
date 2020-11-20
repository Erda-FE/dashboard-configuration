import agent from '../utils/agent';

export const getChartData = ({ url, query, method = 'GET', body }: DC.API) => (
  agent[method.toLowerCase()](url)
    .query(query)
    .send(body)
    .then((response: any) => response.body)
);
