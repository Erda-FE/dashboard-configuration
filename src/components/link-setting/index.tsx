/**
 * 联动设置
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps>;

class LinkSettingModal extends React.PureComponent<IProps> {
  onOk = () => {

  }

  onCancel = () => {

  }

  render() {
    const { linkId } = this.props;
    return (
      <Modal
        title="联动设置"
        visible={!!linkId}
        onOk={this.onOk}
        onCancel={this.onCancel}
        okText="保存"
        cancelText="取消"
      >
      联动设置xxx
      </Modal>
    );
  }
}

const mapStateToProps = ({
  linkSetting: { linkId },
}: any) => ({
  linkId,
});

export default connect(mapStateToProps)(Form.create()(LinkSettingModal));
