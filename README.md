## 如何使用
```js
  // 将model加入项目的model中
  // 引入
  import dashboardModels from '@terminus/bi-ui-package/app/models'

  // 加入，各项目不同，model引入的方式可能不同
  model = [
    ...dashboardModels
  ]
  ...

  // 栅格布局
  import { BoardGrid } from '@terminus/bi-ui-package'
  
  <BoardGrid 
    readOnly={false}
    extra={extra} 
    onSave={this.onSave}
  />
```

```js
  // 只读
  // 默认为false
  readOnly: false

  // 仪表盘的基本信息
  // 非必传, 默认如下
  extra: { 
    layout: [], 布局信息
    drawerInfoMap: {}, // 所有图表配置信息
  }

  // 保存时的回调接口
  // 非必传
  onSave: (extra) => void,
```

## 其他文档
[如何调试](./Debug.md)

[功能规划](https://yuque.antfin-inc.com/docs/share/4d74d1c0-367f-4dd2-94ff-30eb3fcad10a)