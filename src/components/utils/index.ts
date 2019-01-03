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

export function getData(url: string) {
  return agent.get(url)
    .then((response: any) => response.body);
}