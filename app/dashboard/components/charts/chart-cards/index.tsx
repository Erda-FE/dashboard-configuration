/**
 * 基础块状显示图
 */
import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { mockDataCards } from './utils';
import ChartMask from '../chart-mask';
import './index.scss';

interface IData {
  data: any[],
}

interface IProps extends ReturnType<typeof mapStateToProps> {
  chartId: string
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

const ChartCards = ({ option = {}, isMock = false, names = [], datas = [] }: IProps) => {
  const { proportion } = option;
  const layoutSource: any[] = names.map((name: string, i: number) => ({ name, data: datas[0].data[i] }));
  if (proportion.fieldsCount !== layoutSource.length) {
    console.error('fields count not match');
    return null;
  }

  return (
    <React.Fragment>
      <ChartMask isMock={isMock} />
      <section className="bi-cards-layout">
        {
          proportion.config.map((rowConfig: any) => {
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

const mapStateToProps = ({ biDrawer: { drawerInfoMap } }: any, { chartId, isMock, names, datas, option }: any) => {
  const drawerInfo = drawerInfoMap[chartId] || {};
  const { proportion = [] } = isMock ? mockDataCards.option : (option || {});
  const cardsProportion = convertProportion(proportion);
  return {
    chartType: drawerInfo.chartType as string,
    names: isMock ? mockDataCards.names : (names || []) as string[],
    datas: isMock ? mockDataCards.datas : (datas || []) as IData[],
    option: { ...option, proportion: cardsProportion },
  };
};

export default connect(mapStateToProps)(ChartCards);
