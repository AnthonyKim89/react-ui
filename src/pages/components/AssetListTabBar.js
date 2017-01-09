import React, { Component } from 'react';
import { Link } from 'react-router';

import { ASSET_TYPES } from '../constants';

import './AssetListTabBar.css';

class AssetListTabBar extends Component {

  render() {
    return <ul className="c-asset-list-tab-bar">
      {ASSET_TYPES.entrySeq().map(([type, label]) =>
        <li key={type}>
          <Link to={`/assets/${type}`} activeClassName="is-active">
            {label}
          </Link>
        </li>)}
    </ul>;
  }

}

export default AssetListTabBar;