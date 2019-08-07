const read = require('@commitlint/read');

const suffixTypeMap = {
  skip: '_skip',
};

const prefixList = ['feat', 'fix', 'refactor'];

const getTypeEnum = () => prefixList.map(prefix => `${prefix}${suffixTypeMap.skip}`);

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      ...getTypeEnum(), ...prefixList,
      'docs', 'style', 'perf', 'test', 'chore', 'revert', 'WIP',
    ]],
    'type-case': [1, 'always', 'snake-case'],
    'body-empty': async () => {
      let bodyEmpty = [2, 'always'];
      await read({ edit: true }).then((message) => {
        const commitStr = message.toString();
        const type = commitStr.split(':')[0];
        if (prefixList.includes(type) && !type.endsWith(suffixTypeMap.skip)) {
          bodyEmpty = [2, 'never'];
        }
      });
      return bodyEmpty;
    },
  },
};
