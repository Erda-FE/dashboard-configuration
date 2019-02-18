import React, { ReactElement } from 'react';
import { connect } from 'dva';
import { values, get } from 'lodash';
import OperationMenu from '../operation-menu';
import './index.scss';

interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  chartId: string
  children: ReactElement<any>
}

const ControlOperation = ({ children, chartId, isEdit, onChange }: IProps) => (
  <div className="bi-control-operation">
    {React.cloneElement(children, { ...children.props, onChange })}
    {isEdit && <OperationMenu chartId={chartId} />}
  </div>
);

const mapStateToProps = ({ biDashBoard: { isEdit } }: any) => ({
  isEdit,
});

const mapDispatchToProps = (dispatch: any, { chartId }: any) => ({
  onChange(query: object) {
    dispatch({ type: 'linkSetting/updateLinkDataMap', linkId: chartId, values: { chartValue: get(values(query), [0], '') } });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlOperation);
