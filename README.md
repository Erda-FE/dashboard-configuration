# Terminus Project Manage UI

端点项目管理 UI 工程 , 基于 `react + antd`

## Run

- `npm i`
- `npm run web ` (起devServer, 有热加载， 随改随刷新)

## VSCode配置说明
* 安装eslint、tslint、stylelint、prettier
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
    "html",
    {
      "language": "typescript",
      "autoFix": true
    },
    {
      "language": "typescriptreact",
      "autoFix": true
    }
  ],
"prettier.stylelintIntegration": true,
"[css]": {
    "editor.formatOnSave": true
  },
"[scss]": {
    "editor.formatOnSave": true
  },
```

## interface 和 services 的更新

1、 全局安装Jarvis

```shell
npm i -g @terminus/jarvis
```

2、 进入指定工程下，使用 jarvis init

   > 将会生成一份 .jarvis.yml配置文件

3、 启用监听， 使用 jarvis

   > 如果工程下有.jarvis.yml 配置文件则只监听工程的swagger.json的改动
   >
   > 如果没有则监听全局。
   
## 注意事项
1、lodash

  因为 lodash 用模块的方式不能用chain，所以我们统一用 flow 代替。

  chain 是这么写的：
  `chain(historyObj.users).map(user => user.name).join(', ').value()`

  可以改写成

  `flow([(value) => map(value, user => user.name), (value) => join(value, '，')])`

  value 是上一个方法返回的值
  
2、过滤puppeteer的浏览器下载

  已经在.npmrc中增加 `puppeteer_skip_chromium_download=true`

