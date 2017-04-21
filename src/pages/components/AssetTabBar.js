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
        {this.props.assetDashboards.map(tab => this.renderTab(tab))}
        {this.renderCurrentTabName()}
      </ul>
    );
  }

  renderTab(tab) {
    const id = tab.get('id');
    const icon = tab.get('icon');
    const slug = tab.get('slug');
    const name = tab.get('name');
    return <li key={id} className={`c-asset-tab-bar__${icon}-tab`}>
      <Link to={this.getLocation(slug)} activeClassName="is-active">
        {name}
      </Link>
    </li>;
  }

  renderCurrentTabName() {
    const title = this.props.currentAssetDashboards && this.props.currentAssetDashboards.get('name');
    return <li className="c-asset-tab-bar__current-tab-name">{title}</li>;
  }

  getLocation(slug) {
    return {
      pathname: `/assets/${this.props.assetId}/${slug}`,
      query: this.props.pageParams && this.props.pageParams.toJS()
    };
  }

}

AssetTabBar.propTypes = {
  assetId: PropTypes.number.isRequired,
  assetDashboards: ImmutablePropTypes.seq.isRequired,
  currentAssetDashboards: ImmutablePropTypes.map,
  pageParams: ImmutablePropTypes.map
};

export default AssetTabBar;