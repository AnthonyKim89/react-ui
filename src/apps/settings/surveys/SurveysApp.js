import React, { Component, PropTypes } from 'react';
import { format as formatTime } from 'date-fns';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import SurveySummary from './SurveySummary';
import { attributeFormWithUpload } from './SurveyAttributeForm';
import SurveyDetails from './SurveyDetails';
import { SURVEY_DATA_TEMPLATE } from './constants';
import SettingsRecordManager from '../components/SettingsRecordManager';
// import subscriptions from '../../../subscriptions';
import * as api from '../../../api';

// --temp code start
import {fromJS} from 'immutable';
import tempParsed from './temp/parse.json';
import tempMinimum from './temp/minimum.json';
// --temp code end


/**
 * Common app component used by both ActualSurveysApp and PlanSurveysApp because their
 * functionality is identical. They just manage different data collections
 */
class SurveysApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      parsingTaskResult: null
    };
  }

  componentWillReceiveProps(newProps) {
    this.receiveTaskData(newProps);
  }

  receiveTaskData(props,temp) {
    /*if (props) {
      if (this.pendingParseTaskId) {      
        const parseResult = subscriptions.selectors.getSubData(props.data, this.props.parseCollectionConfig); 
        if (parseResult && parseResult.get('task_id') === this.pendingParseTaskId) {
          this.pendingParseTaskId = null;
          this.setState({parsingTaskResult: parseResult.getIn(['data','data'])});
        }
      }

      if (this.pendingMinimumCurvatureTaskId) {
        const minimumCurvatureResult = subscriptions.selectors.getSubData(props.data, this.props.minimumCurvatureCollectionConfig);
        if (minimumCurvatureResult && minimumCurvatureResult.get('task_id') === this.pendingMinimumCurvatureTaskId) {
          this.pendingMinimumCurvatureTaskId = null;

          if (this.afterProcessingHandler) {
            this.afterProcessingHandler(minimumCurvatureResult.getIn(['data']));
          } 
        }
      }
    }*/

    if (!props && temp) { // --temp , should get removed before pushing to QA.

      if (this.pendingParseTaskId) {
        const parseResult = temp;
        if (parseResult && parseResult.get('task_id') === this.pendingParseTaskId) {
          this.pendingParseTaskId = null;
          this.setState({parsingTaskResult: parseResult.getIn(['data','data'])});
        }
      }

      if (this.pendingMinimumCurvatureTaskId) {
        const minimumCurvatureResult = temp;
        if (minimumCurvatureResult && minimumCurvatureResult.get('task_id') === this.pendingMinimumCurvatureTaskId) {
          this.pendingMinimumCurvatureTaskId = null;

          if (this.afterProcessingHandler) {
            this.afterProcessingHandler(minimumCurvatureResult.getIn(['data']));
          }        
        }
      }

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
              hideRecordSummaryInRecordEditor={true}
              preSaveHandler={this.invokeMinimumCurvatureTask.bind(this)}
              RecordSummary={SurveySummary}
              RecordAttributeForm={attributeFormWithUpload(this.state.parsingTaskResult, (...a) => this.invokeParseTask(...a))}
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
      { file_name: file },
      Map({asset_id: this.props.asset.get('id')})
    );

    //-- temp code start
    let tempParsedWrap =fromJS({
      task_id: res.get('task_id'),
      data: tempParsed
    });

    setTimeout(_=> {
      this.receiveTaskData(null,tempParsedWrap);
    },1000);
    //-- temp code end

    this.pendingParseTaskId = res.get('task_id');

  }
  
  async invokeMinimumCurvatureTask(record, afterProcessingHandler) {

    this.afterProcessingHandler = afterProcessingHandler;
    const res = await api.postTaskDocument(
      this.props.minimumCurvatureCollectionConfig.provider,
      this.props.minimumCurvatureCollectionConfig.collection,
      record.getIn(["data"]),
      Map({asset_id: this.props.asset.get('id')})
    );

    console.log("Got the minimum task id");

    //-- temp code start
    tempMinimum.task_id = res.get('task_id');
    let tempMinimumWrap = fromJS(tempMinimum);

    setTimeout(_=> {
      this.receiveTaskData(null,tempMinimumWrap);
    },2000);
    //-- temp code end

    this.pendingMinimumCurvatureTaskId = res.get('task_id');
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
