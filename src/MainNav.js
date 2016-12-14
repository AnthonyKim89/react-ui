import React, { Component, PropTypes } from 'react';
import { IndexLink } from 'react-router';
import { MenuItem, Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './MainNav.css';

class MainNav extends Component {

  render() {
    // Used until we have rig/well listing implemented
    const placeholderWellId = 1016;
    return (
      <Navbar fixedTop className="c-main-nav">
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
            <LinkContainer to={`/wells/${placeholderWellId}/overview`}>
              <NavItem>Wells</NavItem>
            </LinkContainer>
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
    currentUser: ImmutablePropTypes.map,
    logOut: PropTypes.func.isRequired,
}

export default MainNav;
