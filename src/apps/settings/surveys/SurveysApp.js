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
      pendingParseTaskId: null,
      pendingMinimumCurvatureTaskId: null,
      lastTaskResult: null
    };
  }

  componentWillReceiveProps(newProps) {
    this.receiveTaskData(newProps);
  }

  receiveTaskData(props) {
    const parseResult = subscriptions.selectors.getSubData(props.data, this.props.parseCollectionConfig);
    if (parseResult && parseResult.get('task_id') === this.state.pendingParseTaskId) {
      this.setState({pendingParseTaskId: null});
      // Parsing done, invoke the second, minimum curvature task.
      // (This chaining should be done automatically by Lambda function composition in the long run,
      // instead of having the frontend do it.)
      this.invokeMinimumCurvatureTask(parseResult.get('data'));
    }
    const minimumCurvatureResult = subscriptions.selectors.getSubData(props.data, this.props.minimumCurvatureCollectionConfig);
    if (minimumCurvatureResult && minimumCurvatureResult.get('task_id') === this.state.pendingMinimumCurvatureTaskId) {
      this.setState({
        pendingMinimumCurvatureTaskId: null,
        lastTaskResult: minimumCurvatureResult.getIn(['data', 'data'])
      });
    }
  }

  render() {
    return <SettingsRecordManager
              asset={this.props.asset}
              convert={this.props.convert}
              recordProvider={this.props.dataCollectionConfig.provider}
              recordCollection={this.props.dataCollectionConfig.collection}
              recordNamePlural={this.props.recordNamePlural}
              recordNameSingular={this.props.recordNameSingular}
              recordDataTemplate={SURVEY_DATA_TEMPLATE}
              RecordSummary={SurveySummary}
              RecordAttributeForm={attributeFormWithUpload(this.state.lastTaskResult, (...a) => this.invokeParseTask(...a))}
              RecordDetails={SurveyDetails}
              renderRecordListItem={s => this.renderSurveyListItem(s)} />;
  }

  renderSurveyListItem(survey) {
    const timestamp = formatTime(survey.get('timestamp') * 1000, 'ddd MMM Do YYYY');
    return `Date ${timestamp}`;
  }

  async invokeParseTask(file) {
    const res = await api.postTaskDocument(
      this.props.parseCollectionConfig.provider,
      this.props.parseCollectionConfig.collection,
      file,
      Map({asset_id: this.props.asset.get('id')})
    );
    this.setState({pendingParseTaskId: res.get('task_id')});
  }

  async invokeMinimumCurvatureTask(data) {
    const blob = new Blob([JSON.stringify(data.toJS())], {type: 'application/json'});
    const res = await api.postTaskDocument(
      this.props.minimumCurvatureCollectionConfig.provider,
      this.props.minimumCurvatureCollectionConfig.collection,
      blob,
      Map({asset_id: this.props.asset.get('id')})
    );
    this.setState({pendingMinimumCurvatureTaskId: res.get('task_id')});
  }

}

SurveysApp.propTypes = {
  recordNamePlural: PropTypes.string.isRequired,
  recordNameSingular: PropTypes.string.isRequired,
  dataCollectionConfig: PropTypes.object.isRequired,
  parseCollectionConfig: PropTypes.object.isRequired,
  minimumCurvatureCollectionConfig: PropTypes.object.isRequired,
  asset: ImmutablePropTypes.map.isRequired,
  data: ImmutablePropTypes.map
};

export default SurveysApp;
