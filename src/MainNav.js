import React, { Component } from 'react';
import { IndexLink } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

import './MainNav.css';

class NavBar extends Component {
  render() {
    return (
      <Navbar fixedTop className="MainNav">
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to="/">Corva</IndexLink>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <IndexLinkContainer to="/">
            <NavItem>Dashboards</NavItem>
          </IndexLinkContainer>
          <LinkContainer to="/wells">
            <NavItem>Wells</NavItem>
          </LinkContainer>
          <LinkContainer to="/analytics">
            <NavItem>Analytics</NavItem>
          </LinkContainer>
        </Nav>
      </Navbar>
    );
  }
}

export default NavBar;
