import React, { Component } from 'react';
import { Link } from 'react-router';
import { store } from '../../store';
import { dashboards } from '../selectors';

import './DashboardTabBar.css';

class DashboardTabBar extends Component {

  render() {
    return <ul className="c-dashboard-tab-bar">
      {dashboards(store.getState()).map(dashboard =>
        <li key={dashboard.get('id')}>
          <Link to={`/dashboards/${dashboard.get('id')}`} activeClassName="is-active">
            {dashboard.get('name')}
          </Link>
        </li>)}
    </ul>;
  }

}

export default DashboardTabBar;