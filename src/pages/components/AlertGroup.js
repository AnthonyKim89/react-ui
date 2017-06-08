import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Alert from './Alert';

import './AlertGroup.css';

class AlertGroup extends Component {
  render() {
    return (
      <div className="c-alert-group">
        <h2 className="c-alert-group-header">{this.props.title}</h2>

        {this.props.alerts && this.props.alerts.map((alert) => {
            return <Alert key={alert.id} alert={alert} />;
        })}
      </div>
    );
  }
}

AlertGroup.propTypes = {
    alerts: ImmutablePropTypes.list,
    title: PropTypes.string
};

export default AlertGroup;
