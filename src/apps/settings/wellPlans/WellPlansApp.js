import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';


import { SUBSCRIPTIONS } from './constants';
import DrillingTrajectoryEditor from '../common/DrillingTrajectoryEditor';

import './WellPlansApp.css';

class WellPlansApp extends Component {

  render() {
    return <div className="c-well-plans">
      <DrillingTrajectoryEditor data={this.props.data} asset={this.props.asset} subscriptionConfig={SUBSCRIPTIONS} />
    </div>;
  }

}

WellPlansApp.propTypes = {
  data: ImmutablePropTypes.map,
  asset: ImmutablePropTypes.map.isRequired
};

export default WellPlansApp;