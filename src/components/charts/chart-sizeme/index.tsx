import ReactEcharts, { Func } from 'echarts-for-react';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import './index.scss';


type IProps = {
  viewId: string
  data: object
  config: {
    option: object
  }
  style?: object
  getOption(data: object, customOption: object): object
};

// 重写相关生命周期，用于注册theme
const oldComponentDidMount = ReactEcharts.prototype.componentDidMount as Func;
const oldComponentDidUpdate = ReactEcharts.prototype.componentDidUpdate as Func;

ReactEcharts.prototype.componentDidMount = function (...arg) {
  const { theme, themeObj } = this.props;
  this.echartsLib.registerTheme(theme, themeObj);
  oldComponentDidMount.call(this, ...arg);
};

ReactEcharts.prototype.componentDidUpdate = function (...arg) {
  const { theme, themeObj } = this.props;
  this.echartsLib.registerTheme(theme, themeObj);
  oldComponentDidUpdate.call(this, ...arg);
};

class Chart extends React.Component<IProps> {
  static defaultProps = {
    notMerge: true, // 因v4.2.0-rc在切换图形类型或者更新数据更新存在bug,所以必须设置为true
  };

  static contextTypes = {
    theme: PropTypes.string,
    themeObj: PropTypes.object,
  };

  // private onEvents: { [event: string]: Func };

  // componentWillMount() {
  //   this.onEvents = {
  //     click: this.click,
  //   };
  // }

  shouldComponentUpdate(nextProps: IProps) {
    return !isEqual(nextProps, this.props);
  }

  // click = ({ name }: any) => {
  //   this.props.updateLinkDataMap(this.props.viewId, { chartValue: name });
  // }

  render() {
    const { data, config, getOption, style, ...others } = this.props;
    const { theme, themeObj } = this.context;
    console.count('render chart');
    return (
      <div className="bi-chart">
        <ReactEcharts
          {...others}
          option={getOption(data, config.option)}
          theme={theme}
          themeObj={themeObj}
          style={{ ...style, height: '100%' }}
        // onEvents={this.onEvents}
        />
      </div>
    );
  }
}

// const mapDispatchToProps = (dispatch: any) => ({
//   updateLinkDataMap(linkId: string, values: object) {
//     dispatch({ type: 'linkSetting/updateLinkDataMap', linkId, values });
//   },
// });

export default Chart;
