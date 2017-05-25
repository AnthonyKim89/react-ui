import React, { Component, PropTypes } from 'react';
import { NavItem, Navbar, Dropdown, Icon } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import RoutingNavItem from './common/RoutingNavItem';
import { assetDashboards } from './pages/selectors';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as api from './api';

import './MainNav.css';

class MainNav extends Component {

  constructor(props) {
    super(props);
    this.recentAssets = null;
  }

  async componentDidMount() {
    this.recentAssets = await api.getCurrentUserRecentAssets();
  }

  render() {
    let assetDashboardSlug = this.props.assetDashboards.count() > 0 ? this.props.assetDashboards.first().get('slug') : '';
    return (
      <Navbar href={this.getPathToFirstDashboard()} className="c-main-nav">
        <RoutingNavItem className="navbar-brand" to={this.getPathToFirstDashboard()}>Corva</RoutingNavItem>
        {this.hasDashboards() &&
        <RoutingNavItem to={this.getPathToFirstDashboard()}>Dashboards</RoutingNavItem>}
        <Dropdown trigger={<NavItem>Assets</NavItem>}>
          <RoutingNavItem to="/assets/well"><Icon left>dashboard</Icon>All Wells</RoutingNavItem>
          <RoutingNavItem to="/assets/rig"><Icon left>dashboard</Icon>All Rigs</RoutingNavItem>
          {this.recentAssets && this.recentAssets.map(asset =>
            <RoutingNavItem key={asset.get('id')} to={`/assets/${asset.get('id')}/${assetDashboardSlug}`}>
              <div className="c-main-nav__dropdown__outer-icon-circle">
                {asset.get('status') === 'active' ? <div className="c-main-nav__dropdown__inner-icon-circle-active"></div> : <div className="c-main-nav__dropdown__inner-icon-circle-inactive"></div>}
              </div>
              <div className="c-main-nav__dropdown__spacer"></div>{asset.get('name')}
            </RoutingNavItem>)}
        </Dropdown>
        {this.props.currentUser &&
          <Dropdown trigger={<NavItem className="c-user-menu"><Icon className="c-user-menu">perm_identity</Icon></NavItem>} className="c-user-menu">
            <NavItem onClick={() => this.logOut()}>Sign Out</NavItem>
          </Dropdown>
        }
      </Navbar>
      /*
        {this.props.currentUser &&
          <NavItem className="c-main-nav__current-user">
            {this.props.currentUser.getIn(['company', 'name'])}
          </NavItem>
        }*/
    );
  }

  hasDashboards() {
    return !this.props.dashboards.isEmpty();
  }

  getPathToFirstDashboard() {
    if (this.hasDashboards()) {
      const id = this.props.dashboards.first().get('slug');
      return `/dashboards/${id}`;
    } else {
      return '/';
    }
  }

  logOut() {
    this.props.logOut();
  }
  
}

MainNav.propTypes = {
  dashboards: ImmutablePropTypes.seq.isRequired,
  currentUser: ImmutablePropTypes.map,
  logOut: PropTypes.func.isRequired,
};

MainNav.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(
  createStructuredSelector({
    assetDashboards,
  })
)(MainNav);
