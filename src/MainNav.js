import React, { Component } from 'react';
import { IndexLink } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './MainNav.css';

class MainNav extends Component {
  render() {
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
          <LinkContainer to="/wells">
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
    dashboards: ImmutablePropTypes.list.isRequired
}

export default MainNav;
