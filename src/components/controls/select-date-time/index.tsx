import React from 'react';
import { get } from 'lodash';
import { connect } from 'dva';
import { DatePicker } from 'antd';
import { panelControlPrefix } from '../../../utils/constants';
import locale from 'antd/lib/date-picker/locale/zh_CN';

interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  onChange: (query: any) => void
  style?: React.CSSProperties
}

class SelectDateTime extends React.PureComponent<IProps> {
  onOk = (selectDateTime: any) => {
    const { onChange, searchName } = this.props;
    if (!onChange) return;
    onChange({ [searchName]: selectDateTime.format('YYYY-MM-DD HH:mm:ss') });
  }

  render() {
    const { width, style } = this.props;
    return (
      <DatePicker style={{ ...style, width }}
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

const mapStateToProps = ({ chartEditor: { chartMap } }: any, { viewId }: any) => ({
  width: `${get(chartMap, [viewId, `${panelControlPrefix}width`], 120)}px`,
  searchName: get(chartMap, [viewId, `${panelControlPrefix}searchName`], ''),
});

const mapDispatchToProps = (dispatch: any) => ({
  onChoose(controlType: string) {
    dispatch({ type: 'chartEditor/chooseControl', controlType });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectDateTime);
