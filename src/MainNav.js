import React, { Component } from 'react';
import { IndexLink } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
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

}

MainNav.propTypes = {
    dashboards: ImmutablePropTypes.seq.isRequired
}

export default MainNav;
