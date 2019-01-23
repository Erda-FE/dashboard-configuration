import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { get, isEmpty, find, isEqual } from 'lodash';
import { connect } from 'dva';
import { Icon, Dropdown, Menu, Popconfirm, message, Tooltip } from 'antd';
import screenfull from 'screenfull';
import classnames from 'classnames';
import Control from './control';
import { panelDataPrefix, getData, saveImage, setScreenFull } from '../utils';
import './index.scss';
import { convertFormatter } from '../charts/utils';

interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  chartId: string
  children: ReactElement<any>
  onConvert?: (resData: object, chartId: string, url: string) => object | Promise<any>
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
    const { onConvert, chartId } = this.props;
    getData(url, this.query).then((resData: any) => {
      const res1 = onConvert ? onConvert(resData, chartId, url) : resData;
      if (res1 && res1.then) {
        res1.then((res: any) => this.setState({ resData: res }));
      } else {
        this.setState({ resData: res1 });
      }
    }).catch(() => {
      this.setState({ resData: { isMock: true } });
      message.error('该图表接口获取数据失败,将使用mock数据显示', 3);
    });
  }

  deleteChart = () => {
    this.props.deleteChart(this.props.chartId);
  }

  doAction = ({ key }: any) => {
    switch (key) {
      case 'edit':
        return this.props.editChart(this.props.chartId);
      case 'link':
        return this.props.openLinkSetting(this.props.chartId);
      default:
        break;
    }
  }

  deleteLink = (e: any) => {
    e.stopPropagation();
    this.props.deleteLinkMap(this.props.chartId);
  }

  getMenu = () => (
    <Menu onClick={this.doAction}>
      <Menu.Item key="edit">编辑</Menu.Item>
      <Menu.Item key="link" disabled={this.props.canLinked}>
        <span>联动设置</span>
        {this.props.hasLinked && <Icon type="delete" onClick={this.deleteLink} style={{ marginLeft: 8, marginRight: 0 }} />}
      </Menu.Item>
      <Menu.Item key="delete">
        <Popconfirm
          okText="确认"
          cancelText="取消"
          placement="top"
          title="是否确认删除"
          onConfirm={this.deleteChart}
        >删除
        </Popconfirm>
      </Menu.Item>
    </Menu>
  )

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
    let renderData;
    if (typeof dataConvertor === 'function') {
      try {
        renderData = dataConvertor(resData);
      } catch (error) {
        renderData = resData;
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
              <Dropdown overlay={this.getMenu()}>
                <Icon type="dash" />
              </Dropdown>
            </span>)
          }
          <Control chartId={chartId} onChange={this.onControlChange} />
        </div>
        {!isEmpty(renderData) && React.cloneElement(child, { ...child.props, ...renderData, ref: (ref: React.ReactInstance) => { this.chartRef = ref; } })}
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
    linkQuery: paramName ? { [paramName]: get(linkDataMap, [clickId, 'name'], '') } : defaultEmpty, // @todo, 当前不能很好控制linkQuery导致的render问题
    canLinked: !!clickId, // 是否可以进行联动设置
    hasLinked: !!find(linkMap[chartId], value => value), // 是否已经设置了联动
    dataConvertor: dataConvertorFunction as any,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  editChart(chartId: string) {
    dispatch({ type: 'biDrawer/editChart', chartId });
  },
  deleteChart(chartId: string) {
    dispatch({ type: 'biDashBoard/deleteChart', chartId });
  },
  openLinkSetting(linkId: string) {
    dispatch({ type: 'linkSetting/openLinkSetting', linkId });
  },
  deleteLinkMap(linkId: string) {
    dispatch({ type: 'linkSetting/deleteLinkMap', linkId });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartOperation);
