import React from 'react';
import { connect } from 'dva';
import { Drawer, Button } from 'antd';
import './index.scss';

type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ChartDrawer extends React.PureComponent<IProps> {
  render() {
    const { visible, closeDrawer } = this.props;
    return (
      <Drawer
        placement="right"
        visible={visible}
        width={500}
        onClose={closeDrawer}
        mask={false}
        closable={false}
        className="bi-drawer"
      >
        <div className="bi-drawer-content" />
        <div className="bi-drawer-footer">
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={closeDrawer} type="primary">
            提交
          </Button>
        </div>
      </Drawer>
    );
  }
}

const mapStateToProps = ({ biDrawer: { visible } }: any) => ({
  visible,
});

const mapDispatchToProps = (dispatch: any) => ({
  closeDrawer() {
    dispatch({ type: 'biDrawer/closeDrawer' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartDrawer);
