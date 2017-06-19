import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button } from 'react-materialize';

import * as api from '../../api';
import Alert from './Alert';
import LoadingIndicator from '../../common/LoadingIndicator';

import './AlertGroup.css';

class AlertGroup extends Component {

  constructor(props) {
    super(props);
    this.setState({more: true, page: 1});
  }

  componentDidMount() {
    this.getAlerts(this.props.start, this.props.end);
  }

  async getAlerts(start, end) {
    var page = 1;
    if (this.state) {
      page = this.state.page || page;
    }

    let freshAlerts = await api.getAlerts(start, end, page);
    freshAlerts = freshAlerts.toJSON();

    // 20 is the page size. If the API returned fewer than 20 results, that means it's reached the end of the line.
    if (freshAlerts.length < 20) {
      this.setState({more: false});
    }

    if (this.state && this.state.alerts) {
        freshAlerts = this.state.alerts.concat(freshAlerts);
    }

    this.setState({alerts: freshAlerts});
    this.setState({page: page + 1});
  }

  readyToRender() {
    return this.state && this.state.alerts;
  }

  render() {
    return (
      this.readyToRender() ?
      <div className="c-alert-group">
        <h2 className="c-alert-group-header">{this.props.title}</h2>

        {this.state.alerts && this.state.alerts.length === 0 &&
            <div className="c-alert-none">No Alerts Found</div>}
        {this.state.alerts && this.state.alerts.map((alert) => {
                return <Alert key={alert.id} alert={alert} />;
        })}
        {this.state.more &&
            <Button className="c-alert-more" onClick={() => this.getAlerts(this.props.start, this.props.end)}>
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
