import React, { Component } from 'react';

import SurveysApp from '../SurveysApp';
import { SUBSCRIPTIONS } from './constants';

const [ parseSubscription ] = SUBSCRIPTIONS;

class PlanSurveysApp extends Component {

  render() {
    return <SurveysApp
      {...this.props}
      dataCollectionConfig={{devKey: 'corva', collection: 'data.plan_survey'}}
      parseCollectionConfig={parseSubscription} />;
  }

}

export default PlanSurveysApp;
