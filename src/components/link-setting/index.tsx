/**
 * 联动设置
 */
import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps>;

class LinkSettingModal extends React.PureComponent<IProps> {
  onOk = () => {

  }

  onCancel = () => {

  }

  render() {
    return (
      <Modal
        title="联动设置"
        visible
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
      联动设置xxx
      </Modal>
    );
  }
}

const mapStateToProps = ({
  biDrawer: { editChartId },
}: any) => ({
  editChartId,
});

export default connect(mapStateToProps)(LinkSettingModal);
