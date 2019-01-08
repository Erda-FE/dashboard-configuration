import React from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import { DatePicker } from 'antd';
import { pannelControlPrefix } from '../../utils';
import locale from 'antd/lib/date-picker/locale/zh_CN';

interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  onChange: (query: any) => void
}

class SelectDateTime extends React.PureComponent<IProps> {
  onOk = (selectDateTime: any) => {
    const { onChange } = this.props;
    if (!onChange) return;
    onChange({ dateTime: selectDateTime.format('YYYY-MM-DD HH:mm:ss') });
  }

  render() {
    const { width } = this.props;
    return (
      <DatePicker style={{ marginLeft: 12, width }}
        locale={locale}
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        placeholder="选择日期时间"
        onOk={this.onOk}
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectDateTime);
