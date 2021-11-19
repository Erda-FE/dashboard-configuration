module.exports = {
  types: [
    {
      value: 'feat',
      name: 'feat:          新功能',
    },
    {
      value: 'fix',
      name: 'fix:           缺陷修复',
    },
    {
      value: 'refactor',
      name: 'refactor:      重构',
    },
    {
      value: 'style',
      name: 'style:         代码格式优化（不影响代码运行的变动）',
    },
    {
      value: 'chore',
      name: 'chore:         工程化（构建过程或辅助工具的变动）',
    },
    {
      value: 'docs',
      name: 'docs:          文档相关修改',
    },
    {
      value: 'perf',
      name: 'perf:          性能优化（提升性能的代码变动）',
    },
    {
      value: 'test',
      name: 'test:          测试（增加测试）',
    },
    {
      value: 'revert',
      name: 'revert:        回滚',
    },
    {
      value: 'WIP',
      name: 'WIP:           正在进行中的改动',
    },
  ],

  scopes: [{ name: 'component' }, { name: 'board-grid' }, { name: 'pure-board-grid' }],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: '#',
  ticketNumberRegExp: '\\d{0,9}',

  messages: {
    type: '选择你要 Commit 的变更类型：',
    scope: '选择或自定义你的变更范围【可选】：',
    ticketNumber: '输入修改对应的 Issue Id（格式d{0,9}）【可选】：',
    subject: '填写标题:\n',
    body: '填写内容【可选】，用于生成 changLog，选择 feat、fix、refactor 类型后必填此项。（用 "|" 来分行）:\n',
    breaking: '列出破坏性修改【可选】:\n',
    confirmCommit: '确认上面的 Commit 信息?',
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['footer'],
  subjectLimit: 100,
};
