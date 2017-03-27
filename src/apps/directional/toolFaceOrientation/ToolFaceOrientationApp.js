import React, { Component, PropTypes } from 'react';
import { Icon } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
// import { Row, Col } from 'react-materialize';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './ToolFaceOrientationApp.css'


class ToolFaceOrientationApp extends Component {
  render() {
    return (
      <div className="c-di-tfo">
        {this.getSubscriptionData() ?
          this.renderData() :
          <LoadingIndicator />}
        
      </div>
    );
  } 

  renderData() {
    const data = this.getSubscriptionData().get('data');    
    return (
      <div className="c-di-toolface">
        <div className="gaps"></div>
        {data.getIn(['data', 'slides']).last().get("tfo")} <span>°</span>
      </div>
    )
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

