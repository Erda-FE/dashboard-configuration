import React from 'react';
import { get, map } from 'lodash';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/lib/form';
import { pretty } from 'js-object-pretty-print';
import PropTypes from 'prop-types';
import './index.scss';

type IProps = FormComponentProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class PanelData extends React.Component<IProps> {
  static contextTypes = {
    chartsMap: PropTypes.object,
  };

  render() {
    const { viewType, chooseViewType, form } = this.props;
    const { name, mockData, dataSettings } = get(this.context.chartsMap, [viewType], {});
    return (
      <React.Fragment>
        {viewType && (
          <a
            className="bi-demo-text"
            download={`mock-${viewType}.json`}
            href={`data:text/json;charset=utf-8,${pretty(mockData, 4, 'JSON', true)}`}
          >{`${name}数据示例下载`}
          </a>
        )}
        {map(dataSettings, (Setting, i) => <Setting form={form} key={i} />)}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ biEditor: { viewMap, editViewId } }: any) => ({
  viewType: get(viewMap, [editViewId, 'viewType'], ''),
});

const mapDispatchToProps = (dispatch: any) => ({
  chooseViewType() {
    dispatch({ type: 'biEditor/chooseViewType' });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PanelData);
