import { forEach, replace } from 'lodash';
import agent from 'agent';

export const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

export const pannelDataPrefix = 'panneldata#';
export const pannelControlPrefix = 'pannelcontrol#';

export const positiveIntRegExp = /^[1-9]\d*$/;

class ParamsManage {
  private params: IParams | undefined;

  set(params: IParams | undefined) {
    this.params = params;
  }
  get() {
    return this.params || {};
  }
}

export const paramsManage = new ParamsManage();

function convertUrl(url: string) {
  let newUrl = url || '';
  forEach(paramsManage.get(), (value, key) => {
    const pattern = new RegExp(`{${key}}`, 'g');
    newUrl = replace(newUrl, pattern, value);
  });
  return newUrl;
}

export function getData(url: string, query?: any) {
  if (!url) return {};
  return agent.get(convertUrl(url))
    .query(query)
    .then((response: any) => response.body);
}

interface IParams { [name: string]: any }
