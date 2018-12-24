## 如何使用
```js
  // 栅格布局
  import { Board } from 'bi-package'
  <Board 
    extra={extra} 
    onSave={this.onSave}
  />
```

```js
  // 需要传入的基本信息
  extra = {
    layout: [], 布局信息
    chartDatasMap: {}, // 图表基本数据信息
    drawerInfoMap: {}, // 所有图表配置信息
  }

  // 保存时的回调接口
  onSave: (extra) => void,
```