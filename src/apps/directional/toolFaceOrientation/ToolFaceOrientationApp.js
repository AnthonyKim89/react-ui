import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './ToolFaceOrientationApp.css';
import TFOChart from './TFOChart';

class ToolFaceOrientationApp extends Component {  
  render() {    
    return (      
      <div id="c-di-toolface">
        { subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <TFOChart
            container="c-di-toolface"
            convert={this.props.convert}
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

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || !nextProps.coordinates.equals(this.props.coordinates));
  }
}

ToolFaceOrientationApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};


export default ToolFaceOrientationApp;
