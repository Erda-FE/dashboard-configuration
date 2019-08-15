import React, { ReactElement } from 'react';
import { connect } from 'dva';
import { values, get } from 'lodash';
import OperationMenu from '../operation-menu';
import './index.scss';

interface IProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  viewId: string
  children: ReactElement<any>
}

const ControlOperation = ({ children, viewId, isEditMode, onChange }: IProps) => (
  <div className="bi-control-operation">
    {React.cloneElement(children, { ...children.props, onChange })}
    {isEditMode && <OperationMenu viewId={viewId} />}
  </div>
);

const mapStateToProps = ({ dashBoard: { isEditMode } }: any) => ({
  isEditMode,
});

const mapDispatchToProps = (dispatch: any, { viewId }: any) => ({
  onChange(query: object) {
    dispatch({ type: 'linkSetting/updateLinkDataMap', linkId: viewId, values: { chartValue: get(values(query), [0], '') } });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ControlOperation);
