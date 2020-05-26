import React, { ReactElement } from 'react';
import { values, get } from 'lodash';
import OperationMenu from '../operation-menu';
import DashboardStore from '../../../stores/dash-board';

import './index.scss';

interface IProps {
  viewId: string
  children: ReactElement<any>
  isEditMode: boolean;
  onChange: any;
}

const ControlOperation = ({ children, viewId, isEditMode, onChange }: IProps) => (
  <div className="bi-control-operation">
    {React.cloneElement(children, { ...children.props, onChange })}
    {isEditMode && <OperationMenu viewId={viewId} />}
  </div>
);

export default (p: any) => {
  const isEditMode = DashboardStore.useStore(s => s.isEditMode);
  const props = {
    isEditMode,
    onChange: () => {},
  };
  return <ControlOperation {...props} {...p} />;
};
