import React, { Component } from 'react';

import SurveysApp from '../common/SurveysApp';

import { SUBSCRIPTIONS } from './constants';

class ActualSurveysApp extends Component {

  render() {
    return <SurveysApp {...this.props}
                       devKey="corva"
                       collection="data.actual_survey"
                       subscriptionConfig={SUBSCRIPTIONS} />;
  }

}

export default ActualSurveysApp;
