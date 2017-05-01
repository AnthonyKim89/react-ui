import React, { Component } from 'react';

import SurveysApp from '../SurveysApp';
import { SUBSCRIPTIONS, METADATA } from './constants';

const [ parseSubscription, minimumCurvatureSubscription ] = SUBSCRIPTIONS;

class ActualSurveysApp extends Component {

  render() {
    return <SurveysApp
              {...this.props}
              recordNamePlural="Surveys"
              recordNameSingular="Survey"
              title={METADATA.title}
              subtitle={METADATA.subtitle}
              dataCollectionConfig={{provider: 'corva', collection: 'data.actual_survey'}}
              parseCollectionConfig={parseSubscription}
              minimumCurvatureCollectionConfig={minimumCurvatureSubscription} />;
  }

}

export default ActualSurveysApp;
