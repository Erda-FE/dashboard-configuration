export default () => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c}%',
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    x: 'right',
    y: 'center',
  },
  series: [
    {
      name,
      type: 'funnel',
    },
  ],
});
