import React, { Component, PropTypes } from 'react';
import { NavItem } from 'react-materialize';

class RoutingNavItem extends Component {
  render() {
    return (
      <NavItem className={this.props.className} href={this.props.to} onClick={(event) => this.navLoad(event)}>{this.props.children}</NavItem>
    );
  }

  // This takes a click event on a navitem and loads the link without a reload of the page.
  navLoad(event) {
    event.preventDefault();
    this.context.router["push"](this.props.to);
  }
}
RoutingNavItem.propTypes = {
  to: PropTypes.string.isRequired
};
RoutingNavItem.contextTypes = {
  router: PropTypes.object.isRequired
};

export default RoutingNavItem;