module.exports = {
  types: [
    {value: 'feat_skip',      name: 'feat_skip:     新功能'},
    {value: 'fix_skip',       name: 'fix_skip:      缺陷修复'},
    {value: 'refactor_skip',  name: 'refactor_skip: 重构'},
    {value: 'feat',           name: 'feat:          新功能(需要生成 changeLog，必填 body)'},
    {value: 'fix',            name: 'fix:           缺陷修复(需要生成 changeLog，必填 body)'},
    {value: 'refactor',       name: 'refactor:      重构(需要生成 changeLog，必填 body)'},
    {value: 'style',          name: 'style:         代码格式优化（不影响代码运行的变动）'},
    {value: 'chore',          name: 'chore:         工程化（构建过程或辅助工具的变动）'},
    {value: 'docs',           name: 'docs:          文档相关修改'},
    {value: 'perf',           name: 'perf:          性能优化（提升性能的代码变动）'},
    {value: 'test',           name: 'test:          测试（增加测试）'},
    {value: 'revert',         name: 'revert:        回滚'},
    {value: 'WIP',            name: 'WIP:           正在进行中的改动'}
  ],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: '#',
  ticketNumberRegExp: '\\d{0,9}',

  messages: {
    type: '选择你要 Commit 的变更类型：',
    ticketNumber: '输入修改对应的 Issue Id（格式\d{0,9}）【可选】：',
    subject: '填写标题:\n',
    body: '填写内容【可选】，用于生成 changLog，选择 feat、fix、refactor 类型后必填此项。（用 "|" 来分行）:\n',
    breaking: '列出破坏性修改【可选】:\n',
    confirmCommit: '确认上面的 Commit 信息?'
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['scope', 'footer'],
  subjectLimit: 100
};
