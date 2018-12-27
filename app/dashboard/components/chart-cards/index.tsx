/**
 * 基础块状显示图
 */
import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { ReactEchartsPropsTypes } from '../../types';
import { mockDataCards } from './utils';
import './index.scss';

interface IData {
  data: number[]
}

interface IProps extends ReturnType<typeof mapStateToProps>, ReactEchartsPropsTypes {
  chartId: string
  option?: any
  names?: string[],
  datas?: IData[],
  isMock?: boolean
}

const ChartCards = ({ option = {}, names = [], datas, isMock }: IProps) => {
  const realDatas: any[] = isMock ? mockDataCards.datas : (datas || []);
  const { width = '130px', height = '60px' } = option;
  const dataSource: any[] = realDatas[0].data;
  const realNames: any[] = isMock ? mockDataCards.names : (names || []);
  console.log(123, realNames);

  return (
    <React.Fragment>
      {isMock && (
      <div className="bi-chart-mask">
        <div className="bi-mask-inner" />
        <div className="bi-mask-text">模拟数据展示</div>
      </div>
      )}
      <section className="cards-layout">
        {realNames.map((name, i) => {
          const blockData = dataSource[i];
          const { value, status } = blockData;
          return (
            <div key={name} className="cards-block" style={{ minWidth: width, height }}>
              <div className="cards-block-title">{name}</div>
              <div className="cards-block-content"><span>{value}</span>{status !== 'none' && <Icon type={status} />}</div>
            </div>);
        })}
      </section>
    </React.Fragment>);
};

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  return {
    chartType: drawerInfo.chartType as string,
  };
};

export default connect(mapStateToProps)(ChartCards);
