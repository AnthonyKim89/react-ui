import React, { Component, PropTypes } from 'react';
import { Icon } from 'react-materialize';
import { Link } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './AssetTabBar.css';

class AssetTabBar extends Component {

  render() {
    return (
      <ul className="c-asset-tab-bar">
        <li className="c-asset-tab-bar__Title-name"><span>Drilling</span><Icon>keyboard_arrow_right</Icon></li>
        {this.props.assetPageTabs.map(tab => this.renderTab(tab))}
        {this.renderCurrentTabName()}
      </ul>
    );
  }

  renderTab(tab) {
    const category = tab.get('category');
    const name = tab.get('name');
    return <li key={category} className={`c-asset-tab-bar__${category}-tab`}>
      <Link to={this.getLocation(category)} activeClassName="is-active">
        {name}
      </Link>
    </li>;
  }

  renderCurrentTabName() {
    const title = this.props.currentAssetPageTab && this.props.currentAssetPageTab.get('name');
    return <li className="c-asset-tab-bar__current-tab-name">{title}</li>
  }

  getLocation(category) {
    return {
      pathname: `/assets/${this.props.assetId}/${category}`,
      query: this.props.pageParams && this.props.pageParams.toJS()
    };
  }

}

AssetTabBar.propTypes = {
  assetId: PropTypes.number.isRequired,
  assetPageTabs: ImmutablePropTypes.seq.isRequired,
  currentAssetPageTab: ImmutablePropTypes.map,
  pageParams: ImmutablePropTypes.map
};

export default AssetTabBar;