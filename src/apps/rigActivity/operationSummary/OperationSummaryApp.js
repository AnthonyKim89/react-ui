import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Icon, Button } from 'react-materialize';
import { format as formatDate } from 'date-fns';
import * as _ from 'lodash';
import { Map, List } from 'immutable';

import * as api from '../../../api';

import { METADATA, SUPPORTED_OPERATIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './OperationSummaryApp.css';

class OperationSummaryApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: Map()
    };
  }

  componentDidMount() {
    if (this.props.asset) {
      this.getData();
      var intervalId = setInterval(this.getData.bind(this), 60*60*1000);
      this.setState({intervalId: intervalId});
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.asset && (this.props.operationType !== nextProps.operationType || (this.props.asset && this.props.asset.get("id") !== nextProps.asset.get("id")) || !this.props.asset)) {
      this.getData(nextProps.asset, nextProps.operationType);
    }
  }

  render() {
    return (
      this.readyToRender() ?
        (!this.state.emptyData ? 
        <div className="c-ra-operation-summary">
          <div className="row chart-panel">
            <div className="col s1">
              General Activity
            </div>
            <div className="col s11" style={{position: "relative"}}>
              {this.state.activity_groups.map(activity_group =>
                <div key={activity_group.get('_id')} className={this.getGroupBarClassName(activity_group)}
                      style={this.getGroupBarStyle(activity_group)}>
                  {activity_group.getIn(['data', 'activity_name'])}
                </div>
              )}
            </div>
          </div>
          <div className="row chart-panel">
            <div className="col s1" style={{lineHeight: "30px"}}>
              Activity
            </div>
            <div className="col s11" style={{position: "relative"}}>
              {this.state.activities.map(activity =>
                <div key={activity.get('_id')} className={this.getActivityBarClassName(activity)}
                      style={this.getActivityBarStyle(activity)}>
                </div>
              )}
            </div>
          </div>
          {this.state.operations.map(o => 
            <div className="row chart-panel chart-operations" key={o.get('_id')}>
              <div className="col s1">
                {o.get('_id')}
              </div>
              <div className="col s11" style={{position: "relative"}}>
                {o.get('operations').map(operation =>
                  <div key={operation.get('_id')} className={this.getOperationBarClassName(operation)}
                        style={this.getOperationBarStyle(operation)}>
                    {operation.getIn(['data', 'activities']).map(activity =>
                      <div key={`${activity.get('activity_name')}${activity.get('start_time')}`}
                        style={this.getOperationActivityBarStyle(activity, operation)}>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}  
          <div className="row action-panel">
            <div className="col s12">
              <span className="text-info">
                {this.formatDatePeriod()}
              </span>
              &nbsp;&nbsp;&nbsp;
              <Button waves='light' onClick={e => this.first()}>first</Button>
              &nbsp;
              <Button waves='light' onClick={e => this.prev()}>prev</Button>
              &nbsp;
              <Button waves='light' onClick={e => this.next()}>next</Button>
              &nbsp;
              <Button waves='light' onClick={e => this.last()}>last</Button>
            </div>
          </div>
        </div> : this.renderEmpty()) :
        <LoadingIndicator />
    );
  }

  // Render Empty Data
  renderEmpty() {
    return (
      <div className="c-ra-drilling-operations">
        <div className="c-app-container__error">
          <div className="c-app-container__error-grid">
            <div className="c-app-container__error-inner">
              <div className="c-app-container__error_no-data">
                <Icon>info_outline</Icon>
              </div>
              <h1>No results found</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  prev() {
    if (this.state.start_timestamp - 60*60 >= this.state.first_timestamp) {
      this.setState({
        start_timestamp: this.state.start_timestamp - 60*60,
        end_timestamp: this.state.end_timestamp - 60*60
      }, () => this.getData());
    }
  }

  next() {
    if (this.state.end_timestamp + 60*60 <= this.state.last_timestamp) {
      this.setState({
        start_timestamp: this.state.start_timestamp + 60*60,
        end_timestamp: this.state.end_timestamp + 60*60
      }, () => this.getData());
    }
  }

  first() {
    this.setState({
      start_timestamp: this.state.first_timestamp,
      end_timestamp: this.state.first_timestamp + 60*60
    }, () => this.getData());
  }

  last() {
    this.setState({
      start_timestamp: this.state.last_timestamp - 60*60,
      end_timestamp: this.state.last_timestamp
    }, () => this.getData());
  }

  getOperationBarClassName(operation) {
    const name = operation.getIn(['data', 'operation_name']).toString().replace(/ /g, '_');
    return `c-ra-operation-summary__operation-${name}`;
  }

  getOperationBarStyle(operation) {
    const width = (operation.getIn(['data', 'end_timestamp']) - operation.getIn(['data', 'start_timestamp'])) / 3600 * 100;
    const left = (operation.getIn(['data', 'start_timestamp']) - this.state.start_timestamp) / 3600 * 100;
    return {
      width: `${width}%`,
      height: "20px",
      left: `${left}%`,
      display: "inline-block",
      position: "absolute",
      textAlign: "center",
      backgroundColor: "#d2dfd8",
      color: "#000"
    };
  }

  getOperationActivityBarStyle(activity, operation) {
    const end_time = Math.min(activity.get('end_time'), this.state.end_timestamp);
    const start_time = Math.max(activity.get('start_time'), this.state.start_timestamp);
    const max_width = operation.getIn(['data', 'end_timestamp']) - operation.getIn(['data', 'start_timestamp']);
    const width = (end_time - start_time) / max_width * 100;
    const left = (start_time - operation.getIn(['data', 'start_timestamp'])) / max_width * 100;
    return {
      width: `${width}%`,
      height: "20px",
      left: `${left}%`,
      display: "inline-block",
      position: "absolute",
      textAlign: "center",
      backgroundColor: "#58c9c2",
      color: "#000"
    };
  }

  getGroupBarClassName(activity_group) {
    const name = activity_group.getIn(['data', 'activity_name']).toString().replace(/ /g, '_');
    return `c-ra-operation-summary__group-${name}`;
  }

  getGroupBarStyle(activity_group) {
    const width = (activity_group.getIn(['data', 'end_time']) - activity_group.getIn(['data', 'start_time'])) / 3600 * 100;
    const left = (activity_group.getIn(['data', 'start_time']) - this.state.start_timestamp) / 3600 * 100;
    return {
      width: `${width}%`,
      height: "20px",
      left: `${left}%`,
      display: "inline-block",
      position: "absolute",
      textAlign: "center",
      color: "#000"
    };
  }

  getActivityBarClassName(activity) {
    const operation = activity.getIn(['data', 'activity_name']).toString().replace(/ /g, '_');
    return `c-ra-operation-summary__activity-${operation}`;
  }

  getActivityBarStyle(activity) {
    const width = (activity.getIn(['data', 'end_time']) - activity.getIn(['data', 'start_time'])) / 3600 * 100;
    const left = (activity.getIn(['data', 'start_time']) - this.state.start_timestamp) / 3600 * 100;
    return {
      width: `${width}%`,
      height: "30px",
      left: `${left}%`,
      display: "inline-block",
      position: "absolute"
    };
  }

  readyToRender() {
    return this.state.activities || this.state.emptyData;
  }

  getOperation() {
    return _.find(SUPPORTED_OPERATIONS, {type: this.props.operationType || 0}) || {};
  }

  formatDatePeriod() {
    const start_date = new Date(this.state.start_timestamp * 1000);
    const end_date = new Date(this.state.end_timestamp * 1000);
    return formatDate(start_date, 'M/D h:mm') + " - " + formatDate(end_date, 'M/D h:mm');
  }

  onChangeOperationType(event) {
    const currentValue = event.target.value && parseInt(event.target.value, 10);
    this.props.onSettingChange('operationType', currentValue);
  }

  async getData(asset=this.props.asset, operationType=this.props.operationType) {
    this.setState({
      activities: null,
      operations: null,
      emptyData: false
    });
    if (!this.state.start_timestamp) {
      let wits = await api.getAppStorage(METADATA.provider, 'wits', asset.get('id'), Map({
        limit: 1,
        sort: `{timestamp:1}`
      }));
      if (wits && wits.size >= 0) {
        let start_timestamp = wits.get(0).get('timestamp');
        let end_timestamp = start_timestamp + 60*60;
        this.setState({
          start_timestamp: start_timestamp,
          end_timestamp: end_timestamp,
          first_timestamp: start_timestamp
        });
      }
      wits = await api.getAppStorage(METADATA.provider, 'wits', asset.get('id'), Map({
        limit: 1,
        sort: `{timestamp:-1}`
      }));
      if (wits && wits.size >= 0) {
        let timestamp = wits.get(0).get('timestamp');
        this.setState({
          last_timestamp: timestamp
        });
      }
    }
    const start_timestamp = this.state.start_timestamp;
    const end_timestamp = this.state.end_timestamp;
    let activities = await api.getAppStorage(METADATA.provider, 'activities', asset.get('id'), Map({
      query: `{data.start_time#lt#${end_timestamp}}AND{data.end_time#gt#${start_timestamp}}`,
      limit: 99999,
      sort: `{timestamp:1}`
    }));
    activities = activities.map(activity => {
      activity = activity.setIn(['data', 'start_time'], Math.max(parseInt(activity.getIn(['data', 'start_time']), 10), start_timestamp));
      activity = activity.setIn(['data', 'end_time'], Math.min(parseInt(activity.getIn(['data', 'end_time']), 10), end_timestamp));
      return activity;
    });
    let activity_groups = await api.getAppStorage(METADATA.provider, 'activity-groups', asset.get('id'), Map({
      query: `{data.start_time#lt#${end_timestamp}}AND{data.end_time#gt#${start_timestamp}}`,
      limit: 99999,
      sort: `{timestamp:1}`
    }));
    activity_groups = activity_groups.map(activity_group => {
      activity_group = activity_group.setIn(['data', 'start_time'], Math.max(parseInt(activity_group.getIn(['data', 'start_time']), 10), start_timestamp));
      activity_group = activity_group.setIn(['data', 'end_time'], Math.min(parseInt(activity_group.getIn(['data', 'end_time']), 10), end_timestamp));
      return activity_group;
    });
    // {data.activity#eq#${operationType || 0}}AND
    let operations = await api.getAppStorage(METADATA.provider, 'operations', asset.get('id'), Map({
      limit: 9999,
      aggregate: `[ {"$match": {"$and": [{"asset_id": ${asset.get('id')}}, {"data.start_timestamp": {"$lt": ${end_timestamp}}}, {"data.end_timestamp": {"$gt": ${start_timestamp}}}]}}, { "$group" : { "_id" : "$data.operation_name", "operations": { "$push": "$$ROOT" } } } ]`
    }));
    operations = operations.map(o => {
      let trimmed = o.get('operations').map(h => {
        h = h.setIn(['data', 'start_timestamp'], Math.max(parseInt(h.getIn(['data', 'start_timestamp']), 10), start_timestamp));
        h = h.setIn(['data', 'end_timestamp'], Math.min(parseInt(h.getIn(['data', 'end_timestamp']), 10), end_timestamp));
        return h;
      });
      o = o.set('operations', trimmed);
      return o;
    });
    operations = operations.filter(o => o.get('operations').count() > 0);
    let emptyData = false;   
    if (activities) {
      if(activities instanceof List && activities.size === 0) {
        emptyData = true;
      }
    }
    this.setState({
      activities: activities,
      operations: operations,
      activity_groups: activity_groups,
      emptyData: emptyData
    });
  }

}

OperationSummaryApp.propTypes = {
  data: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default OperationSummaryApp;
