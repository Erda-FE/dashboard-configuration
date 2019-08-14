
const metricData = [
  {
    name: 'tset1',
    type: 'line',
    data: [
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
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
    type: 'line',
    data: [
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.77',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.77',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
      '0.78',
    ],
  }, {
    name: 'tset3',
    type: 'line',
    data: [
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
      '0.03',
    ],

  },
];

const staticData = {
  xData: [
    '13:39',
    '13:40',
    '13:41',
    '13:42',
    '13:43',
    '13:44',
    '13:45',
    '13:46',
    '13:47',
    '13:48',
    '13:49',
    '13:50',
    '13:51',
    '13:52',
    '13:53',
    '13:54',
    '13:55',
    '13:56',
    '13:57',
    '13:58',
    '13:59',
    '14:00',
    '14:01',
    '14:02',
    '14:03',
    '14:04',
    '14:05',
    '14:06',
    '14:07',
    '14:08',
    '14:09',
    '14:10',
    '14:11',
    '14:12',
    '14:13',
    '14:14',
    '14:15',
    '14:16',
    '14:17',
    '14:18',
    '14:19',
    '14:20',
    '14:21',
    '14:22',
    '14:23',
    '14:24',
    '14:25',
    '14:26',
    '14:27',
    '14:28',
    '14:29',
    '14:30',
    '14:31',
    '14:32',
    '14:33',
    '14:34',
    '14:35',
    '14:36',
    '14:37',
    '14:38',
  ],
  metricData,
};

export default [
  {
    w: 9,
    h: 12,
    x: 0,
    y: 0,
    i: 'view-1',
    moved: false,
    static: false,
    view: {
      name: 'test',
      chartType: 'chart:line',
      hideHeader: true,
      title: 'zookeeper',
      loadData() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(staticData);
          }, 1000);
        });
      },
      dataConvertor: 'line',
      controls: ['input', 'input2'],
      config: {
        option: {
          legend: {
            orient: 'horizontal',
            bottom: 20,
            // align: 'left',
          },
        },
      },
    },
  },
];
