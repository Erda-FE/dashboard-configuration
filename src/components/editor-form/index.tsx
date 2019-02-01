import React, { Component } from 'react';
import AceEditor from '../ace-editor';

interface IProps{
  onChange?: (value: any) => void;
  value?: string;
  height?: string | number;
  width? :string | number;
  style? : object;
}
const editorOption = {
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
  mode: 'ace/mode/javascript',
  selectionStyle: 'text',
};

const selectionRange = {
  start: {
    row: 1,
    column: 4,
  },
  end: {
    row: 1,
    column: 4,
  },
};

export default class EditorFrom extends Component<IProps> {
  handleChange = (value:string) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  }

  render() {
    const { value, height, width, style } = this.props;
    return (
      <AceEditor
        value={value || ''}
        width={width || '100%'}
        height={height || 150}
        onEvents={{ change: this.handleChange }}
        autoChange={false}
        options={editorOption}
        selectionRange={selectionRange}
        style={style}
      />
    );
  }
}
