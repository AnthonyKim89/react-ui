import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './WellTabBar.css';

class WellTabBar extends Component {
  render() {
    return (
      <ul className="c-well-tab-bar">
        {this.props.wellPages.map(page => this.renderTab(page))}
      </ul>
    );
  }

  renderTab(page) {
    const category = page.get('category');
    const name = page.get('name');
    return <li key={category} className={`c-tab-bar__${category}-tab`}>
      <Link to={this.getPath(category)} activeClassName="is-active">
        {name}
      </Link>
    </li>;
  }

  getPath(category) {
    return `/wells/${this.props.wellId}/${category}`;
  }

}

WellTabBar.propTypes = {
  wellId: PropTypes.number.isRequired,
  wellPages: ImmutablePropTypes.seq.isRequired,
  currentWellPage: ImmutablePropTypes.map
};

export default WellTabBar;