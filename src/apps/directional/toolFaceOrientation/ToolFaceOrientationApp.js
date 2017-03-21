import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
// import { Row, Col } from 'react-materialize';

// import { SUBSCRIPTIONS } from './constants';
// import LoadingIndicator from '../../../common/LoadingIndicator';
// import subscriptions from '../../../subscriptions';

import './ToolFaceOrientationApp.css'

class ToolFaceOrientationApp extends Component {
  render() {
    return (
      <div className="c-di-toolface">
        <div className="gaps"></div>
        <h1>Coming soon</h1>
      </div>
    )
  } 
}

ToolFaceOrientationApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default ToolFaceOrientationApp;

