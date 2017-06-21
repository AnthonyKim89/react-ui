import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import AlertGroup from '../components/AlertGroup';

import './Alerts.css';

class Alerts extends Component {

  constructor(props) {
    super(props);

    this.state = {
        now: moment(),
        dayAgo: moment().subtract(1, 'day')
    };
  }

  render() {
    return (
        <div className="c-alerts">
            <div className="c-alerts-header clearfix">
                <h1 className="pull-left">Alerts</h1>
                <Link to="/alerts/configure" className="btn pull-right">Manage Alerts</Link>
                <div className="clearfix"></div>
            </div>

            <AlertGroup title="Last 24 Hours" start={this.state.dayAgo} end={this.state.now} refresh={60} />
            <AlertGroup title="Older" end={this.state.dayAgo} />
        </div>
    );
  }

}

export default Alerts;
