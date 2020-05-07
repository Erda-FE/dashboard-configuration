import React from 'react';
import { get } from 'lodash';
import { DatePicker } from 'antd';
import { panelControlPrefix } from '../../../utils/constants';
import ChartEditorStore from '../../../stores/chart-editor';

const { RangePicker } = DatePicker;

interface IProps {
  onChange: (query: any) => void
  style?: React.CSSProperties
  searchName: string
  width: string
}

class SelectDateRange extends React.PureComponent<IProps> {
  onChange = (selectDateRange: any[]) => {
    const [start, end] = selectDateRange;
    const { onChange, searchName } = this.props;
    if (!onChange) return;
    onChange({ [searchName]: [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')] });
  }

  render() {
    const { width, style } = this.props;
    return (
      <RangePicker style={{ ...style, width }}
        format="YYYY-MM-DD"
        placeholder={['开始时间', '结束时间']}
        onChange={this.onChange}
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

  return <SelectDateRange {...props} {...rest} />;
};
