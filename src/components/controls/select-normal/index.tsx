import React from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import { Select } from 'antd';

const Option = Select.Option;
type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class SelectNormal extends React.PureComponent<IProps> {
  onChange = (value: string) => {

  }

  render() {
    return (
      <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.onChange}>
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="disabled" disabled>Disabled</Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
    );
  }
}

const mapStateToProps = ({ biDrawer: { drawerInfoMap, editChartId } }: any) => ({
  controlType: get(drawerInfoMap, [editChartId, 'controlType'], ''),
});

const mapDispatchToProps = (dispatch: any) => ({
  onChoose(controlType: string) {
    dispatch({ type: 'biDrawer/chooseControl', controlType });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectNormal);
