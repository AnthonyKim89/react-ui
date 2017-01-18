import React, { Component, PropTypes } from 'react';
import { IndexLink } from 'react-router';
import { MenuItem, Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './MainNav.css';

class MainNav extends Component {

  render() {
    return (
      <Navbar fixedTop fluid className="c-main-nav">
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
      </Navbar>
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
