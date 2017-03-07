import React, { Component } from 'react';

import SurveysApp from '../common/SurveysApp';

import { SUBSCRIPTIONS } from './constants';

class PlanSurveysApp extends Component {

  render() {
    return <SurveysApp {...this.props}
                       devKey="corva"
                       collection="data.plan_survey"
                       subscriptionConfig={SUBSCRIPTIONS} />;
  }

}

export default PlanSurveysApp;
