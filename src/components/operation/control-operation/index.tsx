import React, { ReactElement } from 'react';
import { connect } from 'dva';
import OperationMenu from '../operation-menu';
import './index.scss';

interface IProps extends ReturnType<typeof mapStateToProps> {
  chartId: string
  children: ReactElement<any>
}

const ControlOperation = ({ children, chartId, isEdit }: IProps) => (
  <div className="bi-control-operation">
    {children}
    {isEdit && <OperationMenu chartId={chartId} />}
  </div>
);

const mapStateToProps = ({ biDashBoard: { isEdit } }: any) => ({
  isEdit,
});

export default connect(mapStateToProps)(ControlOperation);
