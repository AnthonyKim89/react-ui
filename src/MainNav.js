import React, { Component, PropTypes } from 'react';
import { Navbar, NavItem, Dropdown, Icon } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './MainNav.css';

class MainNav extends Component {

  render() {
    return (
      <Navbar href={this.getPathToFirstDashboard()} className="c-main-nav">
        <NavItem className="navbar-brand" href={this.getPathToFirstDashboard()} onClick={(event) => this.navLoad(event)}>Corva</NavItem>
        {this.hasDashboards() &&
        <NavItem href={this.getPathToFirstDashboard()} onClick={(event) => this.navLoad(event)}>Dashboards</NavItem>}
        <Dropdown trigger={<NavItem>Assets</NavItem>}>
          <NavItem href="/assets/well" onClick={(event) => this.navLoad(event)}><Icon left>dashboard</Icon>All Wells</NavItem>
          <NavItem href="/assets/rig" onClick={(event) => this.navLoad(event)}><Icon left>dashboard</Icon>All Rigs</NavItem>
          {this.props.recentAssets && this.props.recentAssets.map(asset =>
            <NavItem key={asset.get('id')} href={`/assets/${asset.get('id')}/overview`} onClick={(event) => this.navLoad(event)}><Icon left>dashboard</Icon>{asset.get('name')}</NavItem>)}
        </Dropdown>
        {this.props.currentUser &&
          <Dropdown trigger={<NavItem className="c-user-menu"><Icon className="c-user-menu">perm_identity</Icon></NavItem>} className="c-user-menu">
            <NavItem onClick={() => this.logOut()}>Sign Out</NavItem>
          </Dropdown>
        }
      </Navbar>
      /*
        This doesn't currently seem to do anything when added, but I'm leaving it here just in case Tero has more insight into it.
        {this.props.currentUser &&
          <NavItem className="c-main-nav__current-user">
            {this.props.currentUser.getIn(['company', 'name'])}
          </NavItem>
        }*/
    );
  }

  // This takes a click event on a navitem and loads the link without a reload of the page.
  navLoad(event) {
    event.preventDefault();

    let to = event.target.href;
    to = to.replace("https://", "").replace("http://", "");
    to = to.split("/").splice(1).join("/");
    to = "/" + to;
    this.context.router["push"](to);
  }

  hasDashboards() {
    return !this.props.dashboards.isEmpty();
  }

  getPathToFirstDashboard() {
    if (this.hasDashboards()) {
      const id = this.props.dashboards.first().get('id');
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
  recentAssets: ImmutablePropTypes.list.isRequired,
  currentUser: ImmutablePropTypes.map,
  logOut: PropTypes.func.isRequired,
};

MainNav.contextTypes = {
  router: PropTypes.object.isRequired
};

export default MainNav;
