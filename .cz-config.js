'use strict';

module.exports = {

  types: [
    {value: 'feat_skip',      name: 'feat_skip:     新功能'},
    {value: 'fix_skip',       name: 'fix_skip:      缺陷修复'},
    {value: 'refactor_skip',  name: 'refactor_skip: 重构（即不是新增功能，也不是修改bug的代码变动）'},
    {value: 'feat',           name: 'feat:          新功能(需要生成 changeLog，必填 body)'},
    {value: 'fix',            name: 'fix:           缺陷修复(需要生成 changeLog，必填 body)'},
    {value: 'refactor',       name: 'refactor:      重构（即不是新增功能，也不是修改bug的代码变动）\n                (需要生成 changeLog，必填 body)'},
    {value: 'docs',           name: 'docs:          文档相关修改'},
    {value: 'style',          name: 'style:         代码格式（不影响代码运行的变动）\n                (空格, 格式化, 补充分号等等...)'},
    {value: 'perf',           name: 'perf:          性能优化（提升性能的代码变动）'},
    {value: 'test',           name: 'test:          测试（增加测试）'},
    {value: 'chore',          name: 'chore:         工程化（构建过程或辅助工具的变动）'},
    {value: 'revert',         name: 'revert:        回滚'},
    {value: 'WIP',            name: 'WIP:           正在进行中的改动'}
  ],

  scopes: [
    {name: '普通账号'},
    {name: '管理员'},
    {name: '监控'},
    {name: '容器'}
  ],

  allowTicketNumber: true,
  isTicketNumberRequired: false,
  ticketNumberPrefix: '#',
  ticketNumberRegExp: '\\d{0,9}',

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [

      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  */
  // override the messages, defaults are as follows
  messages: {
    type: 'Select the type of change that you\'re committing:',
    scope: '\nDenote the SCOPE of this change (optional):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: '填写 header:\n',
    body: '填写 body，用于生成 changLog，选择 feat、fix、refactor 类型后必填此项。（用 "|" 来分行）:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?'
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  skipQuestions: ['scope', 'footer'],

  // limit subject length
  subjectLimit: 100


};
