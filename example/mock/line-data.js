import * as React from 'react';

const staticData = {
  xData: [
    '满意',
    '不满意',
    '满不满意',
    '可容忍',
    '不可忍',
    '13:哈哈',
    '1r:哈哈',
    '13rr:哈哈',
    '1r32:哈哈',
    '13:哈ew哈',
    '1r:哈e哈',
  ],
  metricData: [
    {
      name: 'tset1',
      stack: 'a',
      data: [
        '0.33',
        '0.33',
        '0.33',
        '0.33',
        '0.33',
        '0.33',
        '0.33',
        '0.33',
        '0.33',
        '0.33',
        '0.33',
      ],
    },
    {
      name: 'tset2',
      stack: 'a',
      data: [
        '0.78',
        '0.78',
        '0.78',
        '0.78',
        '0.78',
        '0.77',
        '0.33',
        '0.33',
        '0.33',
        '0.33',
        '0.33',
      ],
    }, {
      name: 'tset3',
      data: [
        '0.03',
        '0.03',
        '0.03',
        '0.03',
        '0.03',
        '0.03',
        '0.33',
        '0.33',
        '0.33',
        '0.33',
        '0.33',
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
      chartType: 'chart:bar',
      hideReload: true,
      title: () => <div>tti</div>,
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
        },
      },
      // customRender: chartNode => <div className="SASA" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>{chartNode}</div>,
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
