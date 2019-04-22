import './index.scss';

import { Icon, Tooltip } from 'antd';
import React, { ReactElement } from 'react';
import { find, get, isEmpty, isEqual } from 'lodash';
import { getData, panelDataPrefix, saveImage, setScreenFull } from '../../utils';

import ChartMask from '../../charts/chart-mask';
import Control from './control';
import { IExpand } from '../../../types';
import OperationMenu from '../operation-menu';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { connect } from 'dva';
import { convertFormatter } from '../../charts/utils';
import screenfull from 'screenfull';

interface IProps extends ReturnType<typeof mapStateToProps> {
  chartId: string
  children: ReactElement<any>
  chartType: string
  expandOption?: ({ chartType, url }: IExpand) => object // 扩展图表样式，可用于分图表类型、url，去自定义外围的全局样式
}

const FETCH = 'fetching';
const MOCK = 'mock';
const SUCCESSS = 'success';
const FAIL = 'fail';
interface IMessage {
  isDataEmpty: boolean,
  featchStatus: string
}
const getMessage = ({ isDataEmpty, featchStatus }: IMessage): string => {
  if (featchStatus === MOCK) {
    return '';
  }
  if (featchStatus === FETCH) {
    return '加载中';
  }
  if (isDataEmpty) {
    return '暂无数据';
  }
  if (featchStatus === FAIL) {
    return '数据获取失败';
  }
  return '';
};

const defaultEmpty = {};

class ChartOperation extends React.PureComponent<IProps> {
  state = {
    resData: {}, // 请求的数据
    featchStatus: FETCH, // 请求方式
  };

  private query: any;

  private chartRef: React.ReactInstance;

  componentDidMount() {
    this.reloadData(this.props.url);
  }

  componentWillReceiveProps({ url, isChartEdit, linkQuery }: IProps) {
    if (isChartEdit !== this.props.isChartEdit) {
      this.reloadData(url);
    } else if (!isEqual(linkQuery, this.props.linkQuery)) {
      this.query = { ...this.query, ...linkQuery };
      this.reloadData(url);
    }
  }

  onControlChange = (query: any) => {
    this.query = { ...query, ...this.props.linkQuery };
    this.reloadData(this.props.url);
  }

  reloadData = (url: string) => {
    if (!url) {
      this.setState({ resData: {}, featchStatus: MOCK });
      return;
    }
    getData(url, this.query).then((resData: any) => {
      this.setState({ resData, featchStatus: SUCCESSS });
    }).catch(() => {
      this.setState({ resData: {}, featchStatus: FAIL });
    });
  }

  reloadChart = () => {
    this.reloadData(this.props.url);
  }

  onSaveImg = () => {
    saveImage(ReactDOM.findDOMNode(this.chartRef), this.props.chartId);  // eslint-disable-line
  }

  onSetScreenFull = () => {
    setScreenFull(ReactDOM.findDOMNode(this.chartRef), screenfull.isFullscreen); // eslint-disable-line
  }

  getDefaultOption = () => {
    const { url, chartType, expandOption } = this.props;
    if (expandOption) {
      return expandOption({ url, chartType });
    }
    return defaultEmpty;
  }

  render() {
    const { children, isEdit, isChartEdit, url, chartId, hasLinked, dataConvertor } = this.props;
    const child = React.Children.only(children);
    const { resData, featchStatus } = this.state;
    let renderData = resData;
    if (typeof dataConvertor === 'function') {
      try {
        renderData = dataConvertor(resData);
      } catch (error) {
        console.error('catch error in dataConvertor', error); // eslint-disable-line
      }
    }
    const isMock = featchStatus === MOCK;
    const isDataEmpty = isEmpty(get(renderData, 'datas'));
    const message = getMessage({ isDataEmpty, featchStatus });
    return (
      <div className={classnames({ 'bi-chart-operation': true, active: isChartEdit })}>
        <div className="bi-chart-operation-header-left">
          {hasLinked && <Tooltip placement="bottom" title="已设置联动"><Icon type="link" /></Tooltip>}
        </div>
        <div className="bi-chart-operation-header-right">
          {url && <Icon type="reload" onClick={this.reloadChart} />}
          {isEdit && (
            <span>
              <Tooltip placement="bottom" title="图表全屏">
                <Icon type="arrows-alt" onClick={this.onSetScreenFull} />
              </Tooltip>
              <Tooltip placement="bottom" title="导出图片">
                <Icon type="camera" onClick={this.onSaveImg} />
              </Tooltip>
              <OperationMenu chartId={chartId} />
            </span>)
          }
          <Control chartId={chartId} onChange={this.onControlChange} style={{ marginLeft: 12 }} />
        </div>
        <ChartMask isMock={isMock} message={message} />
        {React.cloneElement(child, {
          ...child.props,
          ...renderData,
          isMock,
          ref: (ref: React.ReactInstance) => { this.chartRef = ref; },
          defaultOption: this.getDefaultOption(),
        })}
      </div>
    );
  }
}
// 从2级对象中获取对应的参数名称、和触发图表id
const getKeyValue = (temp: any, chartId: string) => {
  let paramName = '';
  let clickId = '';
  find(temp, (value: object, key: string) => {
    const tempName = get(value, chartId, '');
    if (tempName) {
      clickId = key;
      paramName = tempName;
    }
    return tempName;
  });
  return { paramName, clickId };
};

const mapStateToProps = ({
  biDashBoard: { isEdit },
  linkSetting: { linkMap, linkDataMap },
  biDrawer: { editChartId, drawerInfoMap } }: any, { chartId }: any) => {
  const { paramName, clickId } = getKeyValue(linkMap, chartId);
  let dataConvertorFunction;
  const dataConvertor = get(drawerInfoMap, [chartId, `${panelDataPrefix}dataConvertor`]);
  if (dataConvertor) {
    dataConvertorFunction = convertFormatter(dataConvertor);
  }
  return {
    isEdit,
    isChartEdit: editChartId === chartId,
    url: get(drawerInfoMap, [chartId, `${panelDataPrefix}url`], '') as string,
    linkQuery: paramName ? { [paramName]: get(linkDataMap, [clickId, 'chartValue'], '') } : defaultEmpty, // @todo, 当前不能很好控制linkQuery导致的render问题
    hasLinked: !!find(linkMap[chartId], value => value), // 是否已经设置了联动
    dataConvertor: dataConvertorFunction as Function,
  };
};

export default connect(mapStateToProps)(ChartOperation);
