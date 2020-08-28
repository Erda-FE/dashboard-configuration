const staticData = {
  xData: [
    '13:39sasasasasas',
    '13:40fdfdfdfdfdf',
    '13:41fdfdsdsdsdsdsdsd',
    '13:42dfdfdfdf',
    '13:4fdfdfd3',
    '13:44fdfdfdfdfdfd',
  ],
  metricData: [
    {
      name: 'tset1',
      // type: 'bar',
      data: [
        '0.03',
        '0.03',
        '0.03',
        '0.03',
        '0.03',
        '0.03',
      ],
    },
    {
      name: 'tset2',
      // type: 'bar',
      data: [
        '0.78',
        '0.78',
        '0.78',
        '0.78',
        '0.78',
        '0.77',
      ],
    }, {
      name: 'tset3',
      // type: 'bar',
      data: [
        '0.03',
        '0.03',
        '0.03',
        '0.03',
        '0.03',
        '0.03',
      ],
    },
  ],
};

export default [
  {
    w: 8,
    h: 9,
    x: 0,
    y: 9,
    i: 'view-1',
    moved: false,
    static: false,
    view: {
      name: 'test',
      chartType: 'chart:line',
      title: 'sasa',
      staticData,
      config: {
        option: {
          tooltip: {
          },
          legend: {
            bottom: 0,
            align: 'left',
          },
          yAxis: [
            {
              type: 'value',
              name: '水量',
              min: 0,
              max: 1,
              interval: 0.1,
              axisLabel: {
                formatter: '{value} ml',
              },
            },
            {
              type: 'value',
              name: '温度',
              min: 0,
              max: 2,
              interval: 0.2,
              axisLabel: {
                formatter: '{value} °C',
              },
            },
          ],
          xAxis: [{
            axisLabel: {
              interval: 0,
              rotate: 45,
            },
          }],
        },
      },
    },
  },
  {
    w: 8,
    h: 9,
    x: 8,
    y: 9,
    i: 'view-3',
    moved: false,
    static: false,
    view: {
      name: 'test',
      chartType: 'table',
      title: '表格图',
      description: 'sasasa',
      staticData: {
        metricData: [
          { id: 1, modelType: 'ods', score: 1 },
        ],
        cols: [
          { title: '模型名称', dataIndex: 'modelType' },
          { title: '质量分', dataIndex: 'score' },
        ],
      },
    },
  },
  {
    w: 8,
    h: 4,
    x: 16,
    y: 9,
    i: 'view-2',
    moved: false,
    static: false,
    view: {
      name: 'test',
      chartType: 'card',
      hideHeader: true,
      hideReload: true,
      staticData: {
        metricData: [
          { name: '数据1', value: 820, unit: 'MB', status: 'rise', color: 'error' },
          { name: '数据2', value: 932, color: 'warning' },
          { name: '数据3', value: 24, unit: 'KB', status: 'fall', color: 'cancel' },
        ],
        proportion: [[1, 1, 1, 1], [1, 1]],
      },
    },
  },
];
