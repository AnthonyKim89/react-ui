import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './ToolFaceOrientationApp.css';


class ToolFaceOrientationApp extends Component {
  render() {
    return (
      <div className="c-di-toolface">
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
        <div className="c-di-toolface-last-tfo">
          {data.get('slides').last().get("tfo")} <span>°</span>
        </div>
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
