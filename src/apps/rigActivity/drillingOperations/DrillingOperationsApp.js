import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input } from 'react-materialize';
import { format as formatDate } from 'date-fns';
import { pull, map, find } from 'lodash';
import { fromJS } from 'immutable';

import { SUBSCRIPTIONS, ACTIVITY_COLORS, PERIOD_TYPES, TARGET, SUPPORTED_OPERATIONS } from './constants';
import ColumnChart from '../../../common/ColumnChart';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './DrillingOperationsApp.css';

class DrillingOperationsApp extends Component {

  render() {
    return (
      this.getData() ?
        <div className="c-ra-drilling-operations">
          <h4>{this.getOperation().title}</h4>
          <h5>{this.getOperation().description}</h5>
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

  getOperation() {
    return find(SUPPORTED_OPERATIONS, {type: this.props.operationType || 0}) || {};
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
    const x = this.getData().getIn(['data', 'operations']).filter(c => c.get('shift') === 'day').count() - 0.5;
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
    return subscriptions.selectors.getSubData(this.props.data, SUBSCRIPTIONS[this.props.operationType || 0]);
  }

  getGraphData() {
    const keys = pull(this.getData()
      .getIn(['data', 'operations']).first().keySeq().toArray(), 'from', 'to', 'shift');
    const sorted = this.getData().getIn(['data', 'operations']).sort((a, b) =>
        a.get('shift').localeCompare(b.get('shift'))
      ).toJS();
    return fromJS(keys.map(key => ({
        name: key,
        data: map(sorted, h => ({
          y: Math.round(h[key]), 
          name: formatDate(h.from*1000, 'M/D h:mm') + ' - ' + formatDate(h.to*1000, 'M/D h:mm')
        })),
        color: ACTIVITY_COLORS[key]
      })));
  }
}

DrillingOperationsApp.propTypes = {
  data: ImmutablePropTypes.map,
  period: PropTypes.number,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired,
  operationType: PropTypes.number.isRequired
};

export default DrillingOperationsApp;
