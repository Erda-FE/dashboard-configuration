import React, { Component } from 'react';
import { isEqual, forEach } from 'lodash';

interface IProps{
  value?: string;
  onEvents?: {[event: string]:Function};
  autoChange?: boolean;
  options?: object;
  width?:string | number;
  height?:string | number;
  style?: object;
  selectionRange?: object;
  placeholder?:string;
}

export default class AceEditor extends Component<IProps> {
  private refEditor: any;

  private editor: any;

  componentWillUnmount() {
    this.editor.destroy();
    this.editor = null;
  }

  componentDidMount() {
    this.configEditor();
  }

  componentWillReceiveProps(nextProps:IProps) {
    if (!this.editor) {
      return;
    }

    const { options: nextOpt, value, selectionRange: nextSelectRange } = nextProps;
    const { options, selectionRange } = this.props;

    if (!isEqual(nextOpt, options)) {
      this.editor.setOptions(nextOpt);
    }
    if (this.editor && this.editor.getValue() !== value) {
      this.editor.setValue(value);
    }

    if (!isEqual(selectionRange, nextSelectRange)) {
      this.editor.selection.setSelectionRange(nextSelectRange);
    }
  }

  configEditor = async () => {
    if (typeof ace === 'undefined') {
      for (let i = 0; i < aceEditor.length; i++) {
        // js 文件有先后依赖关系
        // eslint-disable-next-line
        await loadJsFile(aceEditor[i]);
      }
    }
    const {
      value = '',
      onEvents = {},
      options = {},
      selectionRange,
    } = this.props;

    this.editor = ace.edit(this.refEditor, options);
    this.editor.setValue(value);

    if (selectionRange) {
      this.editor.selection.setSelectionRange(selectionRange);
    }

    this.showPlaceholder();

    // set event
    this.bindEvents(onEvents);
  }

  onChange = (event?:any) => {
    const {
      autoChange = true,
    } = this.props;

    if (autoChange) {
      this.manulChange(event);
    }
  }

  showPlaceholder = () => {
    // 处理placeholder
    const shouldShow = !this.editor.getValue().length;
    const { renderer } = this.editor;
    let node = renderer.emptyMessageNode;
    if (!shouldShow && node) {
      renderer.scroller.removeChild(node);
      renderer.emptyMessageNode = null;
    } else if (shouldShow && !node) {
      const { placeholder } = this.props;
      node = document.createElement('div');
      node.textContent = placeholder;
      node.className = 'ace_invisible ace_emptyMessage';
      node.style.padding = '0 9px';
      renderer.emptyMessageNode = node;
      renderer.scroller.appendChild(node);
    }
  }

  manulChange = (event?:any) => {
    const { onEvents = {} } = this.props;
    const { change } = onEvents;
    change(this.editor.getValue(), event);
  }

  bindEvents = (onEvents:any) => {
    let events = onEvents;
    if (onEvents.change) {
      events = { ...onEvents, change: this.onChange };
    }
    events = { ...event, input: this.showPlaceholder };

    forEach(events, (func, eventName) => {
      if (typeof eventName === 'string' && typeof func === 'function') {
        this.editor.on(eventName, (param:any) => {
          func(param, this.editor);
        });
      }
    });
  };

  render() {
    const { style = {}, width = 500, height = 500, autoChange = true } = this.props;
    const editorStyle = { width, height, ...style };
    return (
      <div>
        <div ref={(ref) => { this.refEditor = ref; }} style={editorStyle} />
        { !autoChange && <a onClick={this.manulChange}>保存</a>}
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
