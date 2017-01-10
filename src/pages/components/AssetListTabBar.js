import React, { Component } from 'react';
import { Link } from 'react-router';

import assets from '../../assets';

import './AssetListTabBar.css';

class AssetListTabBar extends Component {

  render() {
    return <ul className="c-asset-list-tab-bar">
      {assets.constants.ASSET_TYPES.entrySeq().map(([typeCode, assetType]) =>
        <li key={typeCode}>
          <Link to={`/assets/${typeCode}`} activeClassName="is-active">
            {assetType.get('labelPlural')}
          </Link>
        </li>)}
    </ul>;
  }

}

export default AssetListTabBar;