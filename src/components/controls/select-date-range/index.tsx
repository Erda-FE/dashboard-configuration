import React from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import { DatePicker } from 'antd';
import { pannelControlPrefix } from '../../utils';

const { RangePicker } = DatePicker;

interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  onChange: (query: any) => void
}

class SelectDateRange extends React.PureComponent<IProps> {
  onChange = (selectDateRange: any[]) => {
    const [start, end] = selectDateRange;
    const { onChange } = this.props;
    if (!onChange) return;
    onChange({ dateRange: [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')] });
  }

  render() {
    const { width } = this.props;
    return (
      <RangePicker style={{ marginLeft: 12, width }}
        format="YYYY-MM-DD"
        placeholder={['开始时间', '结束时间']}
        onChange={this.onChange}
        allowClear={false}
      />
    );
  }
}

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId }: any) => ({
  width: `${get(drawerInfoMap, [chartId, `${pannelControlPrefix}width`], 120)}px`,
});

const mapDispatchToProps = (dispatch: any) => ({
  onChoose(controlType: string) {
    dispatch({ type: 'biDrawer/chooseControl', controlType });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectDateRange);
