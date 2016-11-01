import React, { Component } from 'react';
import { IndexLink } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

class NavBar extends Component {
  render() {
    return (
      <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to="/" activeClassName="active">Dashboards</IndexLink>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <IndexLinkContainer to="/" activeClassName="active">
            <NavItem>Dashboards</NavItem>
          </IndexLinkContainer>
          <LinkContainer to="/wells" activeClassName="active">
            <NavItem>Wells</NavItem>
          </LinkContainer>
          <LinkContainer to="/analytics" activeClassName="active">
            <NavItem>Analytics</NavItem>
          </LinkContainer>
        </Nav>
      </Navbar>
    );
  }
}

export default NavBar;
