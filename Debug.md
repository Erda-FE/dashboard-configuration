# 项目基础架构

基于 `react + antd`

## 调试

- `npm i`
- `npm run dll && npm run web` // 初次启动
- `npm run web ` // 再次启动 (起devServer, 有热加载，实时刷新)
- `http://127.0.0.1:8010` // 删格化调试页面

## VSCode配置说明
* 必须安装eslint、tslint、stylelint、prettier、scss-lint
* 推荐安装 CSS Modules、colorize、scss intelliSense
* 请使用VScode->Preferences->setting，设置

```shell
"eslint.autoFixOnSave": true,
"tslint.autoFixOnSave": true,
"eslint.validate": [
    "javascript",
    "javascriptreact",
    {
      "language": "vue",
      "autoFix": true
    },
    {
      "language": "vue-html",
      "autoFix": true
    },
  ],
"prettier.stylelintIntegration": true,
"[css]": {
    "editor.formatOnSave": true
  },
"[scss]": {
    "editor.formatOnSave": true
  },
```

## 注意事项
1、lodash

  因为 lodash 用模块的方式不能用chain，所以我们统一用 flow 代替。

  chain 是这么写的：
  `chain(historyObj.users).map(user => user.name).join(', ').value()`

  可以改写成

  `flow([(value) => map(value, user => user.name), (value) => join(value, '，')])`

  value 是上一个方法返回的值


