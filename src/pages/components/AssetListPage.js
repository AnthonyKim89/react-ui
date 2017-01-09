import React, { Component } from 'react';

import AssetListTabBar from './AssetListTabBar';

import './AssetListPage.css';

class AssetListPage extends Component {

  render() {
    return <div className="c-asset-list-page">
      <AssetListTabBar />
    </div>;
  }

}

export default AssetListPage;