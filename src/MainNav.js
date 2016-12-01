import React, { Component, PropTypes } from 'react';
import { IndexLink } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './MainNav.css';

class MainNav extends Component {

  constructor(props) {
    super(props);
    this.state = {profileDropdownOpen: false};
  }

  render() {
    // Used until we have rig/well listing implemented
    const placeholderWellId = 1016;
    return (
      <Navbar fixedTop className="c-main-nav">
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to={this.getPathToFirstDashboard()}>Corva</IndexLink>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          {this.hasDashboards() && 
            <LinkContainer to={this.getPathToFirstDashboard()}>
              <NavItem>Dashboards</NavItem>
            </LinkContainer>}
          <LinkContainer to={`/wells/${placeholderWellId}/overview`}>
            <NavItem>Wells</NavItem>
          </LinkContainer>
        </Nav>
        {this.props.currentUser &&
          <div className="c-main-nav__current-user">
            {this.props.currentUser.getIn(['company', 'name'])}
          </div>}
        {this.props.currentUser &&
          <button className="c-main-nav__profile-dropdown-button"
                  onClick={() => this.toggleProfileDropdown()}>
            P
          </button>}
        {this.state.profileDropdownOpen &&
          <ul className="c-main-nav__profile-dropdown">
            <li>
              <button onClick={() => this.logOut()}>Sign Out</button>
            </li>
          </ul>}
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

  toggleProfileDropdown() {
    this.setState({profileDropdownOpen: !this.state.profileDropdownOpen});
  }

  logOut() {
    this.toggleProfileDropdown();
    this.props.logOut();
  }
  
}

MainNav.propTypes = {
    dashboards: ImmutablePropTypes.seq.isRequired,
    currentUser: ImmutablePropTypes.map,
    logOut: PropTypes.func.isRequired,
}

export default MainNav;
