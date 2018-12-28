/**
 * 基础块状显示图
 */
import React from 'react';
import { connect } from 'dva';
import { get } from 'lodash';
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

const convertProportion = (proportionInput: []) => {
  let fieldsCount: number = 0;
  const config = proportionInput.map((proportion: any, i) => {
    fieldsCount += proportion.cols;
    return { rowNo: i + 1, ...proportion };
  });
  return { fieldsCount, config };
};

const ChartCards = ({ option = {}, isMock, ...others }: IProps) => {
  const names = get(others, ['names'], []);
  const datas = get(others, ['datas'], []);
  const realNames: any = isMock ? mockDataCards.names : names;
  const realDatas: any = isMock ? mockDataCards.datas : datas;
  const { proportion = [] } = isMock ? mockDataCards.option : option;
  const layoutSource: any[] = realNames.map((name: string, i: number) => ({ name, data: realDatas[0].data[i] }));
  const cardsProportion = convertProportion(proportion);
  if (cardsProportion.fieldsCount !== layoutSource.length) {
    console.error('fields count not match');
    return null;
  }

  return (
    <React.Fragment>
      {isMock && (
      <div className="bi-chart-mask">
        <div className="bi-mask-inner" />
        <div className="bi-mask-text">模拟数据展示</div>
      </div>
      )}
      <section className="bi-cards-layout">
        {
          cardsProportion.config.map((rowConfig: any) => {
            const { cols, scale } = rowConfig;
            const source = layoutSource.splice(0, cols);
            return (
              <div className="bi-cards-row" key={rowConfig.rowNo}>
                {
                    source.map((data, i) => {
                      const { name, data: { value, status } } = data;
                      const flex: number = scale ? scale[i] : 1;
                      return (
                        <div key={name} className="bi-cards-block" style={{ flex }}>
                          <div className="bi-cards-block-title"><Icon type="bar-chart" /><span>{name}</span></div>
                          <div className="bi-cards-block-content"><span>{value}</span>{status !== 'none' && <Icon type={status} />}</div>
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
