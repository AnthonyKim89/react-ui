import React, { Component } from 'react';

import SurveysApp from '../SurveysApp';
import { SUBSCRIPTIONS } from './constants';

const [ parseSubscription ] = SUBSCRIPTIONS;

class ActualSurveysApp extends Component {

  render() {
    return <SurveysApp
              {...this.props}
              dataCollectionConfig={{devKey: 'corva', collection: 'data.actual_survey'}}
              parseCollectionConfig={parseSubscription} />;
  }

}

export default ActualSurveysApp;
