import React, { Component, PropTypes } from 'react';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import * as api from '../../../api';
import SurveyBrowser from './SurveyBrowser';
import SurveyEditor from './SurveyEditor';

import './SurveysApp.css';

/**
 * This is a common app base component used by both the actualSurveys app
 * and the plannedSurveys app, since their user interfaces are identical.
 */
class SurveysApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      surveys: List(),
      displayingSurvey: null,
      editingSurvey: null
    };
  }

  componentDidMount() {
    if (this.props.asset) {
      this.loadSurveys(this.props.asset);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.asset !== this.props.asset) {
      this.loadSurveys(newProps.asset)
    }
  }

  async loadSurveys(asset) {
    const surveys = await api.getAppStorage(
      this.props.devKey,
      this.props.collection,
      asset.get('id'), 
      Map({limit: 0})
    );
    this.setState({
      surveys,
      displayingSurvey: surveys.first()
    });
  }

  render() {
    return <div className="c-surveys">
      {this.state.editingSurvey ?
        <SurveyEditor
          survey={this.state.editingSurvey}
          onSave={survey => this.saveSurvey(survey)}
          onCancel={() => this.setState({editingSurvey: null})}
          onDeleteSurvey={() => this.deleteSurvey()}
          subscriptionConfig={this.props.subscriptionConfig} /> :
        <SurveyBrowser
          surveys={this.state.surveys}
          displayingSurvey={this.state.displayingSurvey}
          onSelectSurvey={ds => this.setState({displayingSurvey: ds})}
          onNewSurvey={() => this.setState({editingSurvey: this.makeNewSurvey()})}
          onEditSurvey={() => this.setState({editingSurvey: this.state.displayingSurvey})}
          onDeleteSurvey={() => this.deleteSurvey()} />}
    </div>;
  }

  makeNewSurvey() {
    return Map({
      asset_id: this.props.asset.get('id'),
      data: Map({
        stations: List()
      })
    });
  }

  async saveSurvey(survey) {
    this.setState({editingSurvey: null});
    const savedSurvey = survey.has('_id') ?
      await api.putAppStorage(this.props.devKey, this.props.collection, survey.get('_id'), survey) :
      await api.postAppStorage(this.props.devKey, this.props.collection, survey);
    this.setState({
      surveys: this.state.surveys
        .filterNot(s => s.get('_id') === savedSurvey.getIn('_id'))
        .push(savedSurvey)
        .sortBy(s => s.get('_id')),
      displayingSurvey: savedSurvey
    });
  }

  async deleteSurvey() {
    const survey = this.state.editingSurvey || this.state.displayingSurvey;
    await api.deleteAppStorage(this.props.devKey, this.props.collection, survey.get('_id'));
    const surveysAfterDelete = this.state.surveys
      .filterNot(s => s.get('_id') === survey.get('_id'));
    this.setState({
      surveys: surveysAfterDelete,
      editingSurvey: null,
      displayingSurvey: surveysAfterDelete.first()
    });
  }

}

SurveysApp.propTypes = {
  devKey: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  subscriptionConfig: PropTypes.array.isRequired,
  asset: ImmutablePropTypes.map,
};

export default SurveysApp;
