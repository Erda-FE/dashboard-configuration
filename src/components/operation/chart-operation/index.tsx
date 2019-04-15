import './index.scss';

import { Icon, Tooltip, message } from 'antd';
import React, { ReactElement } from 'react';
import { find, get, isEmpty, isEqual } from 'lodash';
import { getData, panelDataPrefix, saveImage, setScreenFull } from '../../utils';

import Control from './control';
import OperationMenu from '../operation-menu';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { connect } from 'dva';
import { convertFormatter } from '../../charts/utils';
import screenfull from 'screenfull';

interface IProps extends ReturnType<typeof mapStateToProps> {
  chartId: string
  children: ReactElement<any>
}

class ChartOperation extends React.PureComponent<IProps> {
  state = {
    resData: {},
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
      this.setState({ resData: { isMock: true } });
      return;
    }
    getData(url, this.query).then((resData: any) => {
      this.setState({ resData });
    }).catch(() => {
      this.setState({ resData: { isMock: true } });
      message.error('该图表接口获取数据失败,将使用mock数据显示', 3);
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

  render() {
    const { children, isEdit, isChartEdit, url, chartId, hasLinked, dataConvertor } = this.props;
    const child = React.Children.only(children);
    const { resData } = this.state;
    let renderData = resData;
    if (typeof dataConvertor === 'function') {
      try {
        renderData = dataConvertor(resData);
      } catch (error) {
        console.error('catch error in dataConvertor', error); // eslint-disable-line
      }
    }
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
        {isEmpty(get(renderData, 'datas')) ? (
          <div className="bi-empty-tip">暂无数据</div>
        ) : React.cloneElement(child, { ...child.props, ...renderData, ref: (ref: React.ReactInstance) => { this.chartRef = ref; } })}
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

const defaultEmpty = {};

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
    url: get(drawerInfoMap, [chartId, `${panelDataPrefix}url`]) as any,
    linkQuery: paramName ? { [paramName]: get(linkDataMap, [clickId, 'chartValue'], '') } : defaultEmpty, // @todo, 当前不能很好控制linkQuery导致的render问题
    hasLinked: !!find(linkMap[chartId], value => value), // 是否已经设置了联动
    dataConvertor: dataConvertorFunction as any,
  };
};

export default connect(mapStateToProps)(ChartOperation);
