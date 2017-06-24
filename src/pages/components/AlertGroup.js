import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button } from 'react-materialize';
import moment from 'moment';

import * as api from '../../api';
import Alert from './Alert';
import LoadingIndicator from '../../common/LoadingIndicator';

import './AlertGroup.css';

class AlertGroup extends Component {

  constructor(props) {
    super(props);

    var interval = null;
    if (this.props.refresh) {
      interval = setInterval(this.refresh.bind(this), this.props.refresh * 1000);
    }

    this.state = {
      loaded: false,
      more: true,
      page: 1,
      end: this.props.end,
      interval: interval,
      alerts: []
    };
  }

  componentDidMount() {
    this.loadMoreAlerts(this.props.start, this.props.end);
  }

  componentWillUnmount() {
    if (this.state && this.state.interval) {
      clearInterval(this.state.interval);
    }
  }

  async refresh() {
    let start = this.state.end;
    let end = moment();
    let freshAlerts = await this.getAlerts(start, end);
    freshAlerts = freshAlerts.concat(this.state.alerts);

    this.setState({alerts: freshAlerts, end: end});
  }

  async getAlerts(start, end, page) {
    page = page || 1;
    let freshAlerts = await api.getAlerts(start, end, page);
    freshAlerts = freshAlerts.toJSON();

    return freshAlerts;
  }

  async loadMoreAlerts() {
    let page = (this.state && this.state.page) || 1;
    let freshAlerts = await this.getAlerts(this.props.start, this.props.end, page);

    // 20 is the page size. If the API returned fewer than 20 results, that means it's reached the end of the line.
    if (freshAlerts.length < 20) {
      this.setState({more: false});
    }

    if (this.state && this.state.alerts) {
        freshAlerts = this.state.alerts.concat(freshAlerts);
    }

    this.setState({alerts: freshAlerts, page: page + 1, loaded: true});
  }

  render() {
    return (
      this.state.loaded ?
      <div className="c-alert-group">
        <h2 className="c-alert-group-header">{this.props.title}</h2>

        {this.state.alerts && this.state.alerts.length === 0 &&
            <div className="c-alert-none">No Alerts Found</div>}
        {this.state.alerts && this.state.alerts.map((alert) => {
                return <Alert key={alert.id} alert={alert} />;
        })}
        {this.state.more &&
            <Button className="c-alert-more" onClick={() => this.loadMoreAlerts()}>
                Load More
            </Button>
        }
      </div> :
      <LoadingIndicator />
    );
  }
}

AlertGroup.propTypes = {
    alerts: ImmutablePropTypes.list,
    title: PropTypes.string
};

export default AlertGroup;
