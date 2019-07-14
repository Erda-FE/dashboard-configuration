/**
 * 代码弹框编辑器
 * 1、js编辑器，深色主题
 * 2、前后diff
 * 3、通过链接引入，防止第三方系统使用时包过大
 */
import React from 'react';
import { get } from 'lodash';
import { Modal, Tooltip, Icon } from 'antd';
import { connect } from 'dva';
import { pretty } from 'js-object-pretty-print';
import { convertSettingToOption, convertOptionToSetting, convertFormatter } from '../../../charts/utils';
import AceEditor from '../../../ace-editor';
import './index.scss';

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

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

class CodeModal extends React.PureComponent<IProps> {
  private editorValue: string;

  onChange = (value: string) => {
    this.editorValue = value;
  }

  onOk = () => {
    this.props.submitCode(convertOptionToSetting(convertFormatter(this.editorValue)));
    this.props.closeCodeModal();
  }

  render() {
    const { closeCodeModal, codeVisible, option } = this.props;
    return (
      <Modal
        title={
          <div className="bi-in-a-icon">
            <span>代码编辑</span>
            <Tooltip placement="right" title="点击进行示例跳转,编写过程与Echarts编辑器一致">
              <a target="_blank" rel="noopener noreferrer" href="https://www.echartsjs.com/examples/editor.html?c=pie-doughnut">
                <Icon type="question-circle" />
              </a>
            </Tooltip>
          </div>
        }
        visible={codeVisible}
        onOk={this.onOk}
        onCancel={closeCodeModal}
        okText="保存"
        cancelText="取消"
        maskClosable={false}
        width={700}
      >
        <AceEditor
          value={`option = ${pretty(option, 4, 'PRINT', true)}`}
          options={editorOption}
          width={650}
          height={500}
          onEvents={{ change: this.onChange }}
          selectionRange={selectionRange}
          showDiff
        />
      </Modal>
    );
  }
}

const mapStateToProps = ({
  biEditor: { codeVisible, viewMap, editViewId },
}: any) => ({
  codeVisible,
  option: convertSettingToOption(get(viewMap, [editViewId], {})),
});

const mapDispatchToProps = (dispatch: any) => ({
  closeCodeModal() {
    dispatch({ type: 'biEditor/closeCodeModal' });
  },
  submitCode(settingInfo: object) {
    dispatch({ type: 'biEditor/submitCode', settingInfo });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CodeModal);
