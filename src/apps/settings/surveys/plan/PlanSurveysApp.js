import React, { Component } from 'react';

import SurveysApp from '../SurveysApp';
import { SUBSCRIPTIONS } from './constants';

const [ parseSubscription, minimumCurvatureSubscription ] = SUBSCRIPTIONS;

class PlanSurveysApp extends Component {

  render() {
    return <SurveysApp
              {...this.props}
              recordNamePlural="Well Plans"
              recordNameSingular="Well Plan"
              dataCollectionConfig={{provider: 'corva', collection: 'data.plan_survey'}}
              parseCollectionConfig={parseSubscription}
              minimumCurvatureCollectionConfig={minimumCurvatureSubscription} />;
  }

}

export default PlanSurveysApp;
