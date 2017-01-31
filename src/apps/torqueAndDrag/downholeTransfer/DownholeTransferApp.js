import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import LoadingIndicator from '../../../common/LoadingIndicator';

import './DownholeTransferApp.css'

class DownholeTransferApp extends Component {

  render() {
    return (
      <div className="c-tnd-downhole-transfer">
        <LoadingIndicator />
      </div>
    );
  }

}

DownholeTransferApp.propTypes = {
  data: ImmutablePropTypes.map
};

export default DownholeTransferApp;
