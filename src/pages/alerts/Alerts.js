import React, { Component } from 'react';
import { Link } from 'react-router';

import * as api from '../../api';
import AlertGroup from '../components/AlertGroup';
import LoadingIndicator from '../../common/LoadingIndicator';

import './Alerts.css';

class Alerts extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
      this.getAlerts();
  }

  async getAlerts() {
      let alerts = await api.getAlerts();
      alerts = alerts.toJSON();
      this.setState({ alerts: alerts });
  }

  readyToRender() {
    return this.state.alerts;
  }

  render() {
    return (
        this.readyToRender() ?
        <div className="c-alerts">
            <div className="c-alerts-header clearfix">
                <h1 className="pull-left">Alerts</h1>
                <Link to="/alerts/configure" className="btn pull-right">Manage Alerts</Link>
                <div className="clearfix"></div>
            </div>

            <AlertGroup title="Last 24 Hours" alerts={this.state.alerts} />
            <AlertGroup title="Older" alerts={this.state.alerts} />
        </div> :
        <LoadingIndicator />
    );
  }

}

export default Alerts;
