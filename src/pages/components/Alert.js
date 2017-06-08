import React, { Component } from 'react';

import './Alert.css';

class Alert extends Component {
  render() {
    let decision = this.getDecision(alert);

    return (
      <div className={"c-alert c-alert-level-" + this.props.alert.alert_definition.level.toLowerCase()}>
        <div className="c-alert-contents">
            <div className="c-alert-header">
                <h3 className="pull-left">{this.props.alert.alert_definition.name}</h3>
                <div className="pull-right">
                    <span className="c-alert-asset">{this.props.alert.asset.name}</span>
                    <span className="c-alert-timestamp">{this.props.alert.created_at}</span>
                </div>
                <div className="clearfix"></div>
            </div>
            <p className="c-alert-description">{this.props.alert.alert_definition.description}</p>
            <h4 className="c-alert-decision-path-header">Decision Path</h4>
            <p className="c-alert-decision-path">{decision}</p>
        </div>
      </div>
    );
  }

  getDecision(alert) {
      return 'Decision Path Logic Description Here';
  }
}

export default Alert;
