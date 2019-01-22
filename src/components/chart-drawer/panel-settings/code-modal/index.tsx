/**
 * 代码弹框编辑器
 * 1、js编辑器，深色主题
 * 2、前后diff
 * 3、通过链接引入，防止第三方系统使用时包过大
 */
import React from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import './index.scss';

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const aceEditor = [
  'https://cdn.bootcss.com/ace/1.4.2/ace.js',
  'https://cdn.bootcss.com/ace/1.4.2/worker-javascript.js',
  'https://cdn.bootcss.com/ace/1.4.2/ext-language_tools.js',
  'https://cdn.bootcss.com/ace/1.4.2/mode-javascript.js',
  'https://cdn.bootcss.com/ace/1.4.2/snippets/text.js',
  'https://cdn.bootcss.com/ace/1.4.2/snippets/javascript.js',
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

// 初始化编辑器，配置项和百度的配置一致
function initEditor(editor: any) {
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  });
  editor.setValue('option = {\n    \n};\n');
  editor.selection.setSelectionRange({
    start: {
      row: 1,
      column: 4
    },
    end: {
      row: 1,
      column: 4
    }
  });
}

class CodeModal extends React.PureComponent<IProps> {
  private hasLoaded: boolean;

  componentWillReceiveProps({ codeVisible }: IProps) {
    if (!this.hasLoaded && codeVisible && codeVisible !== this.props.codeVisible) {
      (async () => {
        for (let i = 0; i < aceEditor.length; i++) {
          // js 文件有先后依赖关系
          // eslint-disable-next-line
          await loadJsFile(aceEditor[i]);
        }
        this.hasLoaded = true;
        this.forceUpdate();
      })();
    }
  }

  componentDidUpdate() {
    if (typeof ace === 'undefined') {
      return;
    }
    initEditor(ace.edit('editor', {
      mode: 'ace/mode/javascript',
      selectionStyle: 'text',
    }));
  }

  onOk = () => {

  }

  render() {
    const { closeCodeModal, codeVisible } = this.props;
    return (
      <Modal
        title="代码编辑"
        visible={codeVisible}
        onOk={this.onOk}
        onCancel={closeCodeModal}
        okText="保存"
        cancelText="取消"
        maskClosable={false}
        width={700}
      >
        {this.hasLoaded && <div id="editor" className="bi-code-editor"></div>}
      </Modal>
    );
  }
}

const mapStateToProps = ({
  biDrawer: { codeVisible },
}: any) => ({
  codeVisible,
});

const mapDispatchToProps = (dispatch: any) => ({
  closeCodeModal() {
    dispatch({ type: 'biDrawer/closeCodeModal' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CodeModal);
