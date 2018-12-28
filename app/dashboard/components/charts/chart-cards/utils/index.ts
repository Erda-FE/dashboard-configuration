const names = ['数据1', '数据2', '数据3', '数据4', '数据5', '数据6'];
const datas = [{
  data: [{ value: 820, status: 'rise' }, { value: 932, status: 'none' }, { value: 901, status: 'fall' }, { value: 934, status: 'rise' }, { value: 1290, status: 'fall' }, { value: 1330, status: 'rise' }],
}];
const proportion = [{ cols: 2 }, { cols: 3, scale: [1, 2, 1] }, { cols: 1 }];

export const mockDataCards = {
  names,
  datas,
  option: { proportion },
};

