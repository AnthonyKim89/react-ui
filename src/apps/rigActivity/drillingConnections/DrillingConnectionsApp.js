import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input } from 'react-materialize';
import { format as formatDate } from 'date-fns';
import { pull, map, find } from 'lodash';
import { fromJS } from 'immutable';

import { SUBSCRIPTIONS, ACTIVITY_COLORS, PERIOD_TYPES, TARGET, SUPPORTED_CONNECTIONS } from './constants';
import ColumnChart from '../../../common/ColumnChart';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './DrillingConnectionsApp.css'

class DrillingConnectionsApp extends Component {

  render() {
    return (
      this.getData() ?
        <div className="c-ra-drilling-connections">
          <h4>{this.getConnection().title}</h4>
          <h5>{this.getConnection().description}</h5>
          <div className="row chart-panel">
            <div className="col s12">
              <ColumnChart
                data={this.getGraphData()}
                xAxisLines={this.getXAxisLines()}
                yAxisLines={this.getYAxisLines()}>
              </ColumnChart>  
            </div>
          </div>
          <div className="row action-panel">
            <div className="col s12">
              <Input
                className="select-period"
                type="select"
                value={this.props.period}
                onChange={e => this.onChangePeriod(e)}>
                {PERIOD_TYPES.map(item =>
                  <option value={item.value} key={item.value}>
                    {item.label}
                  </option>
                )}
              </Input>
              <span className="text-info">
                {this.formatDatePeriod()}
              </span>
            </div>
          </div>
        </div> :
        <LoadingIndicator />
    );
  }

  getConnection() {
    return find(SUPPORTED_CONNECTIONS, {type: this.props.connectionType || 0}) || {};
  }

  formatDatePeriod() {
    const start_date = new Date(this.getData().getIn(['data', 'start_timestamp']) * 1000);
    const end_date = new Date(this.getData().getIn(['data', 'end_timestamp']) * 1000);
    return formatDate(start_date, 'M/D h:mm') + " - " + formatDate(end_date, 'M/D h:mm');
  }

  onChangePeriod(event) {
    const currentValue = event.target.value && parseInt(event.target.value, 10);
    this.props.onSettingChange('period', currentValue);
  }

  getXAxisLines() {
    const x = this.getData().getIn(['data', 'connections']).filter(c => c.get('shift') === 'day').count() - 0.5;
    return fromJS([{
      value: x,
      text: 'Day&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Night',
      color: '#bbb'
    }]);
  }

  getYAxisLines() {
    return fromJS([{
      value: TARGET,
      text: 'Target',
      color: '#fff'
    }]);
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  getGraphData() {
    const keys = pull(this.getData()
      .getIn(['data', 'connections']).first().keySeq().toArray(), 'from', 'to', 'shift');
    const sorted = this.getData().getIn(['data', 'connections']).sort((a, b) =>
        a.get('shift').localeCompare(b.get('shift'))
      ).toJS();
    return fromJS(keys.map(key => ({
        name: key,
        data: map(sorted, h => ({
          y: Math.round(h[key]), 
          name: formatDate(h.from, 'M/D h:mm') + ' - ' + formatDate(h.to, 'M/D h:mm')
        })),
        color: ACTIVITY_COLORS[key]
      })));
  }
}

DrillingConnectionsApp.propTypes = {
  data: ImmutablePropTypes.map,
  period: PropTypes.number,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired,
  connectionType: PropTypes.number.isRequired
};

export default DrillingConnectionsApp;
