/**
 * 代码弹框编辑器
 * 1、js编辑器，深色主题
 * 2、前后diff
 * 3、通过链接引入，防止第三方系统使用时包过大
 */
import React from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class CodeModal extends React.PureComponent<IProps> {
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
      >
        代码编辑
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
