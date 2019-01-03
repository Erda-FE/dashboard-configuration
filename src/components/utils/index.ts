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

export function getData(url: string, query?: any) {
  return agent.get(url)
    .query(query)
    .then((response: any) => response.body);
}
