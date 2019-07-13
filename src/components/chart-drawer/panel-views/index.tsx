import React from 'react';
import { get, map } from 'lodash';
import classnames from 'classnames';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import { getConfig } from './node_modules/~/config';
import './index.scss';

interface IProps {
  viewType: string
  onChoose(type: string): void
}

const PanelViews = ({ viewType, onChoose }: IProps) => {
  const chartsMap = getConfig('chartsMap');
  return (
    <div>
      {map(chartsMap, ({ icon, name }, type) => (
        <div
          key={type}
          className={classnames({ 'bi-config-editor-views': true, active: type === viewType })}
          onClick={() => onChoose(type)}
        >
          <Tooltip placement="bottom" title={name}>
            {icon}
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = ({ biEditor: { viewMap, editViewId } }: any) => ({
  viewType: get(viewMap, [editViewId, 'viewType'], ''),
});

const mapDispatchToProps = (dispatch: any) => ({
  onChoose(viewType: string) {
    dispatch({ type: 'biEditor/chooseViewType', viewType });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelViews);
