import React, { Component, PropTypes } from 'react';
import { Navbar, NavItem, Dropdown, Button, Icon } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './MainNav.css';

class MainNav extends Component {

  render() {
    return (
      <Navbar href={this.getPathToFirstDashboard()} className="c-main-nav">
        <NavItem className="navbar-brand" href={this.getPathToFirstDashboard()}>Corva</NavItem>
        {this.hasDashboards() &&
        <NavItem href={this.getPathToFirstDashboard()}>Dashboards</NavItem>}
        <Dropdown trigger={<NavItem>Assets</NavItem>}>
          <NavItem href="/assets/well"><Icon left>dashboard</Icon>All Wells</NavItem>
          <NavItem href="/assets/rig"><Icon left>dashboard</Icon>All Rigs</NavItem>
          {this.props.recentAssets && this.props.recentAssets.map(asset =>
            <NavItem key={asset.get('id')} href={`/assets/${asset.get('id')}/overview`}><Icon left>dashboard</Icon>{asset.get('name')}</NavItem>)}
        </Dropdown>
      </Navbar>
      // TODO: Do the right sided sign-out menu item.
      /*<Navbar fixedTop fluid className="c-main-nav">
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to={this.getPathToFirstDashboard()}>Corva</IndexLink>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            {this.hasDashboards() && 
              <LinkContainer to={this.getPathToFirstDashboard()}>
                <NavItem>Dashboards</NavItem>
              </LinkContainer>}
            <NavDropdown title="Assets" id="assetsMenu">
              <LinkContainer to="/assets/well">
                <MenuItem>
                  <span className="c-main-nav__all-assets-icon"></span>
                  All Wells
                </MenuItem>
              </LinkContainer>
              <LinkContainer to="/assets/rig">
                <MenuItem>
                  <span className="c-main-nav__all-assets-icon"></span>
                  All Rigs
                </MenuItem>
              </LinkContainer>
              {this.props.recentAssets && this.props.recentAssets.map(asset => 
                <LinkContainer key={asset.get('id')} to={`/assets/${asset.get('id')}/overview`}>
                  <MenuItem>
                    {asset.get('name')}
                  </MenuItem>
                </LinkContainer>)}
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            {this.props.currentUser &&
              <NavItem className="c-main-nav__current-user">
                {this.props.currentUser.getIn(['company', 'name'])}
              </NavItem>}
            {this.props.currentUser &&
              <NavDropdown className="c-main-nav__profile-dropdown-button" title="P" id="profileMenu">
                 <MenuItem onClick={() => this.logOut()}>Sign Out</MenuItem>
              </NavDropdown>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>*/
    );
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
}

export default MainNav;
