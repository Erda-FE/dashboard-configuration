const read = require('@commitlint/read');
const types = require('./.cz-config.js').types;

const suffixTypeMap = { skip: '_skip' };
const prefixList = ['feat', 'fix', 'refactor'];
const getTypeEnum = () => prefixList.map((prefix) => `${prefix}${suffixTypeMap.skip}`);

// Rules: https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', types.map((type) => type.value)],
    'type-case': [1, 'always', 'snake-case'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'scope-case': [2, 'always', 'kebab-case'],
    // 'body-empty': async () => {
    //   let bodyEmpty = [2, 'always'];
    //   await read({ edit: true }).then((message) => {
    //     const commitStr = message.toString();
    //     const type = commitStr.split(':')[0];
    //     if (prefixList.includes(type) && !type.endsWith(suffixTypeMap.skip)) {
    //       bodyEmpty = [2, 'never'];
    //     }
    //   });
    //   return bodyEmpty;
    // },
  },
};
