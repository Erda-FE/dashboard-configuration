export default [
  {
    path: '*',
    getComponent: () => import('../../src/board-grid'),
  },
];
