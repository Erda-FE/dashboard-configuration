import React from 'react';
import { get } from 'lodash';
import { DatePicker } from 'antd';
import { panelControlPrefix } from '../../../utils/constants';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import ChartEditorStore from '../../../stores/chart-editor';

interface IProps {
  onChange: (query: any) => void
  style?: React.CSSProperties
  searchName: string
  width: string
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

export default ({ viewId, ...rest }: any) => {
  const viewMap = ChartEditorStore.useStore(s => s.viewMap);
  const { chooseControl } = ChartEditorStore;
  const props = {
    width: `${get(viewMap, [viewId, `${panelControlPrefix}width`], 120)}px`,
    searchName: get(viewMap, [viewId, `${panelControlPrefix}searchName`], ''),
    onChoose: chooseControl,
  };

  return <SelectDateTime {...props} {...rest} />;
};
