import React from 'react';
import { connect } from 'dva';
import { Drawer } from 'antd';

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
      />
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
