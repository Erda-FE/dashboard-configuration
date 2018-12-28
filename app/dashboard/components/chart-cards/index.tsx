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
  const { layout } = isMock ? mockDataCards.option : option;
  const realNames: any[] = isMock ? mockDataCards.names : (names || []);
  const dataSource: any[] = realNames.map((name, i) => ({ name, data: realDatas[0].data[i] }));
  if (layout.fieldsCount !== dataSource.length) {
    console.error('fields count not match');
    return;
  }
  return (
    <React.Fragment>
      {isMock && (
      <div className="bi-chart-mask">
        <div className="bi-mask-inner" />
        <div className="bi-mask-text">模拟数据展示</div>
      </div>
      )}
      <section className="cards-layout">
        {
          layout.config.map((rowConfig: any) => {
            const { cols, proportion } = rowConfig;
            const source = dataSource.splice(0, cols);
            return (
              <div className="cards-row" key={rowConfig.rowNo}>
                {
                    source.map((data, i) => {
                      const { name, data: { value, status } } = data;
                      const flex: number = proportion ? proportion[i] : 1;
                      return (
                        <div key={name} className="cards-block" style={{ flex }}>
                          <div className="cards-block-title"><Icon type="bar-chart" /><span>{name}</span></div>
                          <div className="cards-block-content"><span>{value}</span>{status !== 'none' && <Icon type={status} />}</div>
                        </div>);
                    })
                }
              </div>);
          })
        }
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
