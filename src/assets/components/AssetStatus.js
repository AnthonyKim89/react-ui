import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { capitalize } from 'lodash';

import './AssetStatus.css';

// Render the status of an asset as a text label as well as a visual indicator where applicable
class AssetStatus extends Component {
  
  render() {
    const status = this.props.asset.get('status');
    return <span className="c-asset-status">
      {this.isMarkerSupported() &&
        <span className={`c-asset-status__marker c-asset-status__marker--${status}`} />}
      {capitalize(status)}
    </span>;
  }

  isMarkerSupported() {
    return this.props.asset.get('status') === 'drilling';
  }

}

AssetStatus.propTypes = {
  asset: ImmutablePropTypes.map.isRequired
};

export default AssetStatus;
