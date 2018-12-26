## 如何使用
```js
  // 栅格布局
  import { BoardGrid } from 'bi-package'
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