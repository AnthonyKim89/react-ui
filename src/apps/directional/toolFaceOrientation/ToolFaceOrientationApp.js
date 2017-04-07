import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './ToolFaceOrientationApp.css';
import TFOChart from './TFOChart';

class ToolFaceOrientationApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {    
    return (      
      <div id="c-di-toolface">
        { subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <TFOChart
            container="c-di-toolface"
            data={subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(["data","slides"])}
          /> :
          <LoadingIndicator/>
        }
      </div>
    );
  } 

  getSubscriptionData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }
}

ToolFaceOrientationApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};


export default ToolFaceOrientationApp;
