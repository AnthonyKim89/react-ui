import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as api from '../../../api';
import subscriptions from '../../../subscriptions';

class DrillingTrajectoryEditor extends Component {

  render() {
    return <div className="c-surveys">
      <input type="file" ref={r => this.uploadField = r} />
      <button onClick={() => this.upload()}>
        Upload
      </button>

      {this.getUploadedData()}
    </div>;
  }

  getUploadedData() {
    const data = subscriptions.selectors.firstSubData(this.props.data, this.props.subscriptionConfig);
    if (data && data.get('task_id') === this.state.lastUploadTaskId) {
      return data.get('data');
    }
  }

  async upload() {
    const res = await api.postTaskDocument(
      'corva',
      'tasks.survey-parser',
      this.uploadField.files[0],
      Map({asset_id: this.props.asset.get('id')})
    );
    this.setState({lastUploadTaskId: res.get('task_id')});
  }

}

DrillingTrajectoryEditor.propTypes = {
  data: ImmutablePropTypes.map,
  asset: ImmutablePropTypes.map.isRequired,
  subscriptionConfig: PropTypes.array.isRequired
};

export default DrillingTrajectoryEditor;