import React, { Component } from 'react';
import { debounce, isEqual } from 'lodash';

interface IProps{
  value?: string;
  onEvents?: object;
  options?: object;
  width?:string;
  height?:string;
  onChange?: (value:string, event:any)=>void;
  style?: object
  onBeforeLoad?: (ace:any)=>void;
}

export default class AceEditor extends Component<IProps> {
  private refEditor: any;

  private editor: any;

  private silent: boolean;

  constructor(props:IProps) {
    super(props);
    if (typeof ace === 'undefined') {
      (async () => {
        for (let i = 0; i < aceEditor.length; i++) {
          // js 文件有先后依赖关系
          // eslint-disable-next-line
          await loadJsFile(aceEditor[i]);
        }
        if (!this.editor) {
          this.configEditor();
        }
      })();
    }
  }

  componentWillUnmount() {
    this.editor.destroy();
    this.editor = null;
  }

  componentDidUpdate(oldProps:IProps) {
    if (!this.editor) {
      return;
    }
    const { options: oldOpt } = oldProps;
    const { options, value } = this.props;
    if (!isEqual(oldOpt, options)) {
      this.editor.setOptions(options);
    }
    if (this.editor && this.editor.getValue() !== value) {
      this.editor.setValue(value);
    }
  }

  configEditor = () => {
    const {
      onBeforeLoad,
      value = '',
      onEvents = {},
      options = {},
    } = this.props;

    this.editor = ace.edit(this.refEditor, options);

    if (onBeforeLoad) {
      onBeforeLoad(ace);
    }

    this.onChange = debounce(this.onChange, 200);

    this.editor.setValue(value);

    this.bindEvents(this.editor, onEvents);
  }

  onChange = (event:any) => {
    if (this.props.onChange && !this.silent) {
      const value = this.editor.getValue();
      this.props.onChange(value, event);
    }
  }

  bindEvents = (instance:any, events:object) => {
    const _bindEvent = (eventName:string, func:Function) => {
      if (typeof eventName === 'string' && typeof func === 'function') {
        instance.on(eventName, (param:any) => {
          func(param, instance);
        });
      }
    };

    for (const eventName in events) {
      if (Object.prototype.hasOwnProperty.call(events, eventName)) {
        _bindEvent(eventName, events[eventName]);
      }
    }
  };

  render() {
    const { style = {}, width = '500px', height = '500px' } = this.props;
    const editorStyle = { width, height, ...style };
    return (
      <div>
        <div ref={(ref) => { this.refEditor = ref; }} style={editorStyle} />
        格式化
      </div>
    );
  }
}

const aceversion = '1.4.2';
const aceEditor = [
  `https://cdn.bootcss.com/ace/${aceversion}/ace.js`,
  `https://cdn.bootcss.com/ace/${aceversion}/worker-javascript.js`,
  `https://cdn.bootcss.com/ace/${aceversion}/ext-language_tools.js`,
  `https://cdn.bootcss.com/ace/${aceversion}/mode-javascript.js`,
  `https://cdn.bootcss.com/ace/${aceversion}/snippets/text.js`,
  `https://cdn.bootcss.com/ace/${aceversion}/snippets/javascript.js`,
];

function loadJsFile(src: string) {
  const id = src.split('/').reverse()[0];
  if (document.getElementById(id)) {
    return Promise.resolve(id);
  }
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.id = id;
    document.body.appendChild(script);
    script.onload = () => {
      resolve(id);
    };
  });
}
