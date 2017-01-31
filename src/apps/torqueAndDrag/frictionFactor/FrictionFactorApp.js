import React, { Component } from 'react';

import LoadingIndicator from '../../../common/LoadingIndicator';

import './FrictionFactorApp.css'

class FrictionFactorApp extends Component {

  render() {
    return (
      <div className="c-tnd-friction-factor">
        <LoadingIndicator />
      </div>
    );
  }

}

FrictionFactorApp.propTypes = {
};

export default FrictionFactorApp;
