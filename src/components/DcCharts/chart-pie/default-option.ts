export default () => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    x: 'right',
    y: 'center',
  },
});
