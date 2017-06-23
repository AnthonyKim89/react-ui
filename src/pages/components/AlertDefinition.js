import React, { Component } from 'react';
import { Button, Input } from 'react-materialize';

import './AlertDefinition.css';

class AlertDefinition extends Component {

  getFriendlyDataPointName(dataPoint) {
    if (dataPoint.indexOf('.') !== -1) {
      dataPoint = dataPoint.split('.').pop();
    }
    dataPoint = dataPoint.replace(/_/g, ' ');
    if (dataPoint === dataPoint.toUpperCase()) {
      return dataPoint;
    }

    dataPoint = dataPoint.replace(/\b\w/g, w => w.toUpperCase());
    return dataPoint;
  }

  handleClick(event) {
    if (event.target.getAttribute('name') !== 'active' && event.target.getAttribute('class') !== 'lever') {
      this.props.onClick(event);
    }
  }

  render() {

    return (
      <div className="c-alert-definition" onClick={this.handleClick.bind(this)}>
        { this.props.alert &&
          <div className="c-alert-definition-contents">
            <h2 className="c-alert-definition-name">{this.props.alert.name}</h2>
            <p className="c-alert-definition-description">{this.props.alert.description}</p>
            <Input name="active" type="switch" value="true" defaultChecked={this.props.alert.active} onChange={this.props.onToggle} />
            <div className="c-alert-definition-filters">
              <h3 className="c-alert-definition-filters-header">Filters</h3>
              <ol>
                {this.props.alert.filters && this.props.alert.filters.map((filter) => {
                  return <li key={filter.id}>{this.getFriendlyDataPointName(filter.data_point)} {filter.operator} {filter.threshold} {this.props.alert.filters.length > 1 ? this.props.alert.filter_logic.toLowerCase() : ''}</li>;
                })}
              </ol>
            </div>
            <div className="c-alert-definition-notifications">
              <h3 className="c-alert-definition-notifications-header">Subscribe</h3>
              {this.props.alert.alert_notification_types.map((alert_notification_type) => {
                return (
                  <div key={alert_notification_type.id} className="c-alert-definition-notification-toggle">
                    <h4 className="c-alert-definition-notification-type-header">{alert_notification_type.name}</h4>
                    <Input name="active" type="switch" onLabel="&#8203;" offLabel="&#8203;" value={alert_notification_type.identifier} defaultChecked={alert_notification_type.enabled} onChange={this.props.onSubscribe} />
                  </div>
                );
              })}
            </div>
          </div>
        }
        { !this.props.alert &&
          <div className="c-alert-definition-new">
            <Button flat floating icon="add"></Button>
          </div>
        }
      </div>
    );
  }

}

export default AlertDefinition;
