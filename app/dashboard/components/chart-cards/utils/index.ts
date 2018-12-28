const names = ['数据1', '数据2', '数据3', '数据4', '数据5', '数据6'];
const datas = [{
  data: [{ value: 820, status: 'rise' }, { value: 932, status: 'none' }, { value: 901, status: 'fall' }, { value: 934, status: 'rise' }, { value: 1290, status: 'fall' }, { value: 1330, status: 'rise' }],
}];
const layout = { fieldsCount: 6, config: [{ cols: 2, rowNo: 1 }, { cols: 3, rowNo: 2, proportion: [1, 2, 1] }, { rowNo: 3, cols: 1 }] };

export const mockDataCards = {
  names,
  datas,
  option: { layout },
};

