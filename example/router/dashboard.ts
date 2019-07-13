export default [
  {
    path: '*',
    getComponent: () => import('board-grid'),
  },
];
