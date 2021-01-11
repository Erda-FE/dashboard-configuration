export default () => ({
  tooltip: {
    trigger: 'item',
    transitionDuration: 0.5,
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  visualMap: {
    left: 'right',
    min: 1,
    max: 2000,
    inRange: {
      color: ['lightskyblue', 'yellow', 'orangered'],
    },
    text: ['High', 'Low'], // 文本，默认为数值文本
    calculable: true,
  },
});
