import React, { Component } from 'react';

import SurveysApp from '../SurveysApp';
import { SUBSCRIPTIONS } from './constants';

const [ parseSubscription, minimumCurvatureSubscription ] = SUBSCRIPTIONS;

class ActualSurveysApp extends Component {

  render() {
    return <SurveysApp
              {...this.props}
              recordNamePlural="Surveys"
              recordNameSingular="Survey"
              dataCollectionConfig={{devKey: 'corva', collection: 'data.actual_survey'}}
              parseCollectionConfig={parseSubscription}
              minimumCurvatureCollectionConfig={minimumCurvatureSubscription} />;
  }

}

export default ActualSurveysApp;
