import React, { Component, PropTypes } from 'react';
import { format as formatTime } from 'date-fns';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import SurveySummary from './SurveySummary';
import { attributeFormWithUpload } from './SurveyAttributeForm';
import SurveyDetails from './SurveyDetails';
import { SURVEY_DATA_TEMPLATE } from './constants';
import SettingsRecordManager from '../components/SettingsRecordManager';
import subscriptions from '../../../subscriptions';
import * as api from '../../../api';

/**
 * Common app component used by both ActualSurveysApp and PlanSurveysApp because their
 * functionality is identical. They just manage different data collections
 */
class SurveysApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pendingUploadTaskId: null,
      lastUploadResult: null
    };
  }

  componentWillReceiveProps(newProps) {
    this.receiveUploadedTaskData(newProps);
  }

  receiveUploadedTaskData(props) {
    const data = subscriptions.selectors.getSubData(props.data, this.props.parseCollectionConfig);
    if (data && data.get('task_id') === this.state.pendingUploadTaskId) {
      this.setState({
        pendingUploadTaskId: null,
        lastUploadResult: data.getIn(['data', 'data'])
      });
    }
  }

  render() {
    return <SettingsRecordManager
              asset={this.props.asset}
              convert={this.props.convert}
              recordDevKey={this.props.dataCollectionConfig.devKey}
              recordCollection={this.props.dataCollectionConfig.collection}
              recordNamePlural="Well Plans"
              recordNameSingular="Well Plan"
              recordDataTemplate={SURVEY_DATA_TEMPLATE}
              RecordSummary={SurveySummary}
              RecordAttributeForm={attributeFormWithUpload(this.state.lastUploadResult, (...a) => this.upload(...a))}
              RecordDetails={SurveyDetails}
              renderRecordListItem={s => this.renderSurveyListItem(s)} />;
  }

  renderSurveyListItem(survey) {
    const timestamp = formatTime(survey.get('timestamp') * 1000, 'ddd MMM Do YYYY');
    return `Date ${timestamp}`;
  }

  async upload(file) {
    const res = await api.postTaskDocument(
      'corva',
      'tasks.survey-parser',
      file,
      Map({asset_id: this.props.asset.get('id')})
    );
    this.setState({pendingUploadTaskId: res.get('task_id')});
  }

  

}

SurveysApp.propTypes = {
  dataCollectionConfig: PropTypes.object.isRequired,
  parseCollectionConfig: PropTypes.object.isRequired,
  asset: ImmutablePropTypes.map.isRequired,
  data: ImmutablePropTypes.map
};

export default SurveysApp;
