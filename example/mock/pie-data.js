const data = {
  legendData: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
  metricData: [
    {
      name: '访问来源',
      data: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' },
      ],
    },
  ],
};

export default [
  {
    w: 12,
    h: 9,
    x: 0,
    y: 0,
    i: 'view-pie',
    moved: false,
    static: false,
    view: {
      name: '访问来源',
      chartType: 'chart:pie',
      staticData: data,
      loadData() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(data);
          }, 1000);
        });
      },
      // dataConvertor: 'ajax',
      controls: ['input'],
      config: {
        option: {
          legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'bottom',
          },
          series: [{
            radius: ['50%', '70%'],
            label: {
              normal: {
                formatter: '{b}:  {c}  {d}%',
              },
            },
          }],
        },
      },
    },
  },
];
