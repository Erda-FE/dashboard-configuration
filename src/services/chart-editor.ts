import { get } from 'lodash';
import DC from 'src/types';
import produce from 'immer';
import agent from 'common/utils/agent';


const getOrgFromPath = () => {
  return get(location.pathname.split('/'), '[1]') || '-';
};

export const setApiWithOrg = (api: string) => {
  return api.startsWith('/api/')
    ? api.replace('/api/', `/api/${getOrgFromPath()}/`)
    : api;
};

export const getChartData = ({ url, query, method = 'get', body }: DC.API) => {
  const resultBody = produce(body, (draft: Obj<any[]>) => {
    for (const key in draft) {
      if (Object.prototype.hasOwnProperty.call(draft, key)) {
        draft[key] = draft[key].filter((item: string) => item); // remove undefined and null
      }
    }
  });

  return agent(setApiWithOrg(url), {
    method: method.toUpperCase(),
    query,
    body: resultBody,
  });
};

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
  return agent(setApiWithOrg(setApiWithOrg(`/api/metrics/${metric}/export`)), {
    method: 'POST',
    query,
    body: payload,
  });
};
