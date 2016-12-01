import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './WellTabBar.css';

class WellTabBar extends Component {
  render() {
    return (
      <ul className="c-well-tab-bar">
        {this.props.wellPages.map(page => this.renderTab(page))}
        {this.renderCurrentTabName()}
      </ul>
    );
  }

  renderTab(page) {
    const category = page.get('category');
    const name = page.get('name');
    return <li key={category} className={`c-well-tab-bar__${category}-tab`}>
      <Link to={this.getLocation(category)} activeClassName="is-active">
        {name}
      </Link>
    </li>;
  }

  renderCurrentTabName() {
    const title = this.props.currentWellPage && this.props.currentWellPage.get('name');
    return <li className="c-well-tab-bar__current-tab-name">{title}</li>
  }

  getLocation(category) {
    return {
      pathname: `/wells/${this.props.wellId}/${category}`,
      query: {drillTime: this.props.wellDrillTime.toJSON()}
    };
  }

}

WellTabBar.propTypes = {
  wellId: PropTypes.number.isRequired,
  wellPages: ImmutablePropTypes.seq.isRequired,
  currentWellPage: ImmutablePropTypes.map,
  wellDrillTime: PropTypes.object
};

export default WellTabBar;