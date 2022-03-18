export default () => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
    renderMode: 'html',
    appendToBody: true,
  },
  legend: {
    type: 'scroll',
    icon: 'reat',
    itemWidth: 12,
    itemHeight: 3,
    bottom: true,
  },
});
