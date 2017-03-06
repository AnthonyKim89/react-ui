import React, { Component } from 'react';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as api from '../../../api';
import subscriptions from '../../../subscriptions';

import { SUBSCRIPTIONS } from './constants';
import './SurveysApp.css';

class SurveysApp extends Component {

  render() {
    return <div className="c-surveys">
      <input type="file" ref={r => this.uploadField = r} />
      <button onClick={() => this.upload()}
              disabled={!this.isFileSelected()}>
        Upload
      </button>

      {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS)}
    </div>;
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

  isFileSelected() {
    return this.uploadField && this.uploadField.files.length > 0;
  }

}

SurveysApp.propTypes = {
  data: ImmutablePropTypes.map,
  asset: ImmutablePropTypes.map.isRequired
};

export default SurveysApp;