import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input } from 'react-materialize';
import { format as formatDate } from 'date-fns';
import * as _ from 'lodash';
import { fromJS, Map } from 'immutable';

import * as api from '../../../api';

import { ACTIVITY_COLORS, PERIOD_TYPES, SUPPORTED_OPERATIONS, METADATA } from './constants';
import ColumnChart from '../../../common/ColumnChart';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './DrillingOperationsApp.css';

class DrillingOperationsApp extends Component {

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
    if (this.props.asset && (this.props.period !== nextProps.period || this.props.operationType !== nextProps.operationType || this.props.asset !== nextProps.asset)) {
      this.getData(nextProps.asset, nextProps.period, nextProps.operationType);
    }
  }

  render() {
    return (
      this.readyToRender() ?
        <div className="c-ra-drilling-operations">
          <h4>{this.getOperation().title}</h4>
          <h5>{this.getOperation().description}</h5>
          <div className="row chart-panel">
            <div className="col s12">
              <ColumnChart
                data={this.getGraphData()}
                xAxisLines={this.getXAxisLines()}
                yAxisLines={this.getYAxisLines()}
                legendEnabled={true}
                tooltipPointFormat="{series.name}: {point.y} secs">
              </ColumnChart>  
            </div>
          </div>
          <div className="row action-panel">
            <div className="col s12">
              <Input
                className="select-period dropdown-editor"
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

  readyToRender() {
    return this.state.data && this.state.data.count() > 0;
  }

  getOperation() {
    return _.find(SUPPORTED_OPERATIONS, {type: this.props.operationType || 0}) || {};
  }

  formatDatePeriod() {
    const start_date = new Date(this.state.data.getIn(['data', 'start_timestamp']) * 1000);
    const end_date = new Date(this.state.data.getIn(['data', 'end_timestamp']) * 1000);
    return formatDate(start_date, 'M/D h:mm') + " - " + formatDate(end_date, 'M/D h:mm');
  }

  onChangePeriod(event) {
    const currentValue = event.target.value && parseInt(event.target.value, 10);
    this.props.onSettingChange('period', currentValue);
  }

  getXAxisLines() {
    let shift;
    let lines = [];
    let i = 0;
    this.state.data.getIn(['data', 'operations']).forEach(h => {
      if (shift && shift !== 'day & night' && shift !== h.get('shift') && h.get('shift') !== 'day & night') {
        lines.push({
          value: i - 0.5,
          text: shift === 'day' ? 'Day&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Night' : 'Night&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Day',
          color: '#bbb'
        });
      } else if (h.get('shift') === 'day & night' && i !== 0) {
        lines.push({
          value: i,
          text: shift === 'day' ? 'Day&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Night' : 'Night&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Day',
          color: '#bbb'
        });
      }
      shift = h.get('shift');
      i ++;
    });
    return fromJS(lines);
  }

  getYAxisLines() {
    if (this.props.target) {
      return fromJS([{
        value: parseFloat(this.props.target),
        text: 'Target',
        color: '#fff'
      }]);
    } else {
      return fromJS([]);
    }
  }

  async getData(asset=this.props.asset, period=this.props.period, operationType=this.props.operationType) {
    this.setState({
      data: null
    });
    let data = await api.getAppStorage(METADATA.provider, METADATA.collections[period || 0], asset.get('id'), Map({
      query: `{data.operation#eq#'${operationType || 0}'}`,
      limit: 1
    }));
    if (data) {
      data = data.get(0);
    }
    this.setState({
      data: data
    });
  }

  getGraphData() {
    let keys = [];
    this.state.data.getIn(['data', 'operations']).forEach(h => {
      _.pull(h.keySeq().toArray(), 'from', 'to', 'shift').forEach(v => {
        keys.push(v);
      });
    });
    keys = _.uniq(keys);
    const sorted = this.state.data.getIn(['data', 'operations']).toJS();

    var graph_data =  fromJS(keys.map(key => ({
        name: key,
        data: _.map(sorted, h => ({
          y: parseFloat(h[key]).fixFloat(1), 
          name: formatDate(h.from*1000, 'M/D h:mm') + ' - ' + formatDate(h.to*1000, 'M/D h:mm')
        })),
        color: ACTIVITY_COLORS[key]
      })));

    return graph_data;
  }

  getFakeData() {
    let data = {
      "app": "ai.corva.rig_activity.drilling_operations",
      "timestamp": 1474347110,
      "data": {
        "start_timestamp": 1474347110,
        "end_timestamp": 1474347110,
        "operations": [{
          "from": 1474347110,
          "to": 1474347110,
          "Connection": 100,
          "Reaming Upwards": 10,
          "Washing Upwards": 20,
          "Circulating": 30,
          "shift": "day"
        },{
          "from": 1474347110,
          "to": 1474347110,
          "Connection": 100,
          "Reaming Upwards": 10,
          "Washing Upwards": 20,
          "Circulating": 30,
          "shift": "day"
        },{
          "from": 1474347110,
          "to": 1474347110,
          "Connection": 100,
          "Reaming Upwards": 10,
          "Washing Upwards": 20,
          "Circulating": 30,
          "shift": "day"
        },{
          "from": 1474347110,
          "to": 1474347110,
          "Connection": 100,
          "Reaming Upwards": 10,
          "Washing Upwards": 20,
          "Circulating": 30,
          "shift": "day"
        },{
          "from": 1474347110,
          "to": 1474347110,
          "Connection": 100,
          "Reaming Upwards": 10,
          "Washing Upwards": 20,
          "Circulating": 30,
          "shift": "day"
        },{
          "from": 1474347110,
          "to": 1474347110,
          "Connection": 100,
          "Reaming Upwards": 10,
          "Washing Upwards": 20,
          "Circulating": 30,
          "shift": "day"
        },{
          "from": 1474347110,
          "to": 1474347110,
          "Connection": 100,
          "Reaming Upwards": 10,
          "Washing Upwards": 20,
          "Circulating": 30,
          "shift": "day"
        },{
          "from": 1474347110,
          "to": 1474347110,
          "Connection": 100,
          "Reaming Upwards": 10,
          "Washing Upwards": 20,
          "Circulating": 30,
          "shift": "day"
        },{
          "from": 1474347110,
          "to": 1474347110,
          "Connection": 100,
          "Reaming Upwards": 10,
          "Washing Upwards": 20,
          "Circulating": 30,
          "shift": "day"
        },{
          "from": 1474347110,
          "to": 1474347110,
          "Connection": 100,
          "Reaming Upwards": 10,
          "Washing Upwards": 20,
          "Circulating": 30,
          "shift": "day"
        },{
          "from": 1474347110,
          "to": 1474347110,
          "Connection": 100,
          "Reaming Upwards": 10,
          "Washing Upwards": 20,
          "Circulating": 30,
          "shift": "day"
        },{
          "from": 1474347110,
          "to": 1474347110,
          "Connection": 100,
          "Reaming Upwards": 10,
          "Washing Upwards": 20,
          "Circulating": 30,
          "shift": "day"
        }]
      }
    };
    data.timestamp = Math.floor(Date.now() / 1000);
    data.data.start_timestamp = Math.floor(Date.now() / 1000 - 24*60*60);
    data.data.end_timestamp = Math.floor(Date.now() / 1000);
    let i = 0;
    data.data.operations.forEach(h => {
      h['from'] = data.data.start_timestamp + 2*60*60*i; 
      h['to'] = data.data.start_timestamp + 2*60*60*(i+1);
      if (i >= 6) h['shift'] = 'night'; else h['shift'] = 'day';
      _.without(_.keys(h), 'from', 'to', 'shift').forEach(function(activity) {
        h[activity] *= Math.random()*0.2 + 0.8;
      });
      i++;
    });
    return fromJS(data);
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
