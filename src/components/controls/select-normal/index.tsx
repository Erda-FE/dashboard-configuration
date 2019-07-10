import React from 'react';
import { get, isEqual, map, isEmpty } from 'lodash';
import { connect } from 'dva';
import { Select, message } from 'antd';
import { OptionProps } from 'antd/lib/select';
import { getData, strToObject } from '~/utils/comp';
import { panelControlPrefix } from '~/utils/constants';
import { checkFixedData } from './utils';

const { Option } = Select;
interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  onChange: (query: any) => void
  style?: React.CSSProperties
}

class SelectNormal extends React.PureComponent<IProps> {
  state = {
    resData: [],
  };

  componentWillReceiveProps(nextProps: IProps) {
    if (!isEqual(nextProps.url, this.props.url) || !isEqual(nextProps.fixedData, this.props.fixedData)) {
      this.handleData(nextProps);
    }
  }

  onChange = (value: string) => {
    const { searchName, onChange } = this.props;
    if (!onChange) return;
    onChange({ [searchName]: value });
  }

  handleData = ({ url, fixedData }: IProps) => {
    if (url) { // 接口获取
      getData(url).then((resData: any) => {
        this.setState({ resData });
      }).catch(() => {
        message.error('常规下拉框接口获取动态数据失败', 3);
      });
    } else if (checkFixedData(fixedData)) { // 静态数据
      const resData = strToObject(fixedData);
      this.setState({ resData });
    }
  }

  onFocus = () => {
    if (isEmpty(this.state.resData)) {
      this.handleData(this.props);
    }
  }

  render() {
    const { width, multiple, canSearch, style } = this.props;
    const { resData } = this.state;
    const otherProps: any = {};
    if (multiple) {
      otherProps.mode = 'multiple';
    }
    if (canSearch) {
      otherProps.showSearch = true;
      otherProps.optionFilterProp = 'children';
      // @ts-ignore
      otherProps.filterOption = (input: string, option: React.ReactElement<OptionProps>) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    return (
      <Select
        placeholder="请选择"
        style={{ ...style, width }}
        onChange={this.onChange}
        onFocus={this.onFocus}
        {...otherProps}
      >
        <Option key="all" value="">请选择</Option>
        {map(resData, ({ name, value }, i) => <Option key={value || `${i}`} value={value}>{name}</Option>)}
      </Select>
    );
  }
}

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId }: any) => ({
  width: get(drawerInfoMap, [chartId, `${panelControlPrefix}width`], 120),
  searchName: get(drawerInfoMap, [chartId, `${panelControlPrefix}searchName`], ''),
  multiple: get(drawerInfoMap, [chartId, `${panelControlPrefix}multiple`], false),
  canSearch: get(drawerInfoMap, [chartId, `${panelControlPrefix}canSearch`], false),
  url: get(drawerInfoMap, [chartId, `${panelControlPrefix}url`], ''),
  fixedData: get(drawerInfoMap, [chartId, `${panelControlPrefix}fixedData`], '[]'),
});

const mapDispatchToProps = (dispatch: any) => ({
  onChoose(controlType: string) {
    dispatch({ type: 'biDrawer/chooseControl', controlType });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectNormal);
