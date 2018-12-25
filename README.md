## 如何使用
```js
  // 栅格布局
  import { Board } from 'bi-package'
  <Board 
    readOnly={false}
    extra={extra} 
    onSave={this.onSave}
  />
```

```js
  // 只读
  // 默认为false
  readOnly: false
  // 需要传入的基本信息
  // 非必传, 默认如下
  extra: { 
    layout: [], 布局信息
    drawerInfoMap: {}, // 所有图表配置信息
  }

  // 保存时的回调接口
  // 非必传
  onSave: (extra) => void,
```