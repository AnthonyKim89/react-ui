import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';
//import Heatmap from '../../../common/Heatmap';

import './OptimizationApp.css'

class OptimizationApp extends Component {
  
  render() {
    console.log(this.props.data)
    console.log(SUBSCRIPTIONS)
    return (
      <div className="c-de-optimization">
        { subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <h1>Coming soon</h1>
          : <LoadingIndicator />
        }
      </div>
    );
  }
}

OptimizationApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string
};

export default OptimizationApp;
