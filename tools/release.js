#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const execSync  = require('child_process').execSync;
const semverInc = require('semver/functions/inc');
const pkg = require('../package.json');

const GET_BRANCH_CMD = "git branch | awk '/\\*/ { print $2; }'";
const UPDATE_SUB_MODULES = "git pull --recurse-submodules";
const GEN_CHANGELOG = 'npm run changelog';

const getCurrentBranch = async () => {
  execSync(UPDATE_SUB_MODULES);
  return await execSync(GET_BRANCH_CMD).toString();
};
const STYLE = {
  message: chalk.yellow.bold,
};
const TIP = {
  message: (...msg) => console.log(STYLE.message(...msg)),
  success: (msg) => console.log(chalk.bgGreen.bold(`👏   ${msg}`)),
  error: (...msg) => console.log(chalk.bgRedBright.bold('⚠️  发包中断，出现问题！\n'), ...msg),
  exit: () => console.log(chalk.bgMagentaBright.bold('👋👋👋  拜拜...\n')),
};
const exit = () => {
  TIP.exit();
  process.exit(0);
};

const confirmBranch = async () => {
  const branch = await getCurrentBranch();
  TIP.message('当前分支：', branch);
  if (!branch.startsWith('release')) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'currentBranch',
        message: `当前分支不是 release 分支，是否继续发包？`,
        default: '否',
        choices: ['否', '是'],
      },
    ]);
    if (answer.currentBranch === '否') exit();
  }
};

const selectVersionType = async () => {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'releaseType',
      message: '请选择发包版本类型：',
      default: 'patch',
      choices: ['patch', 'minor', 'major']
    }
  ]);
  return answer.releaseType;
}

const confirmVersion = async (version) => {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmVersion',
      message: `即将发布版本 ${version}，是否继续？`
    }
  ])
  if (!answer.confirmVersion) exit();
}

const confirmChangelog = async (version) => {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmChangelog',
      message: `可以检查生成的 changelog，确认无误后开始推送代码？`
    }
  ])
  if (!answer.confirmChangelog) exit();
}

const goRelease = async (version) => {
  const npm = [
    `npm version ${version}`,
    'npm whoami --registry=https://registry.npm.terminus.io',
    'npm publish --registry=https://registry.npm.terminus.io',
  ];
  const git = [
    'git add --all',
    'git commit -m "chore: changelog"',
    'git push',
    `git push origin refs/tags/v${version}`,
  ];

  npm.forEach(command => TIP.message(execSync(command).toString()));
  TIP.success('已发布到 https://registry.npm.terminus.io');
  const spinner = ora(STYLE.message('开始生成 changelog...')).start();
  execSync(GEN_CHANGELOG);
  spinner.succeed(STYLE.message('已生成 changelog!'));
  await confirmChangelog();
  git.forEach(command => TIP.message(execSync(command).toString()));
  TIP.success('更新已推送！');
}

const release = async () => {
  try {
    await confirmBranch();
    const releaseType = await selectVersionType();
    const version = semverInc(pkg.version, releaseType);
    await confirmVersion(version);
    await goRelease(version);
    exit();
  } catch (err) {
    TIP.error();
  }
};

release();
