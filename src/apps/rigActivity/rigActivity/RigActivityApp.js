import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input } from 'react-materialize';
import { format as formatDate } from 'date-fns';
import { fromJS, Map } from 'immutable';

import * as api from '../../../api';

import { ACTIVITY_COLORS, PERIOD_TYPES, DISPLAY_FORMATS, METADATA } from './constants';
import PieChart from '../../../common/PieChart';
import LoadingIndicator from '../../../common/LoadingIndicator';
import common from '../../../common';

import './RigActivityApp.css';

class RigActivityApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: Map()
    };
  }

  componentDidMount() {
    if (this.props.asset) {
      this.getData();
      // Update every 5 minutes
      var intervalId = setInterval(this.getData.bind(this), 60*60*1000);
      this.setState({intervalId: intervalId});
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.asset && (this.props.period !== nextProps.period || this.props.asset !== nextProps.asset)) {
      this.getData();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.data !== this.props.data || 
      nextProps.data !== this.props.data || 
      nextProps.coordinates !== this.props.coordinates ||
      nextProps.graphColors !== this.props.graphColors ||
      nextProps.period !== this.props.period || 
      nextProps.displayFormat !== this.props.displayFormat);
  }

  render() {
    return (
      this.readyToRender() ?
        <div className="c-ra-rig-activity">
          <div className="row">
            <div className={"col " + (this.isExpanded() ? "s6" : "s12")}>
              <div className="row chart-panel">
                <div className="col s8">
                  {this.renderCombinedChart()}
                </div>
                <div className="col s4">
                  <div className="row sub-panel">
                    {this.renderDayChart()}
                  </div>
                  <div className="row sub-panel">
                    {this.renderNightChart()}                
                  </div>
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
            </div>
            {this.renderTable()}              
          </div>
        </div> :
        <LoadingIndicator />
    );
  }

  readyToRender() {
    return this.state.data && this.state.data.count() > 0;
  }

  renderTable() {
    if (this.isExpanded()) {
      return (<div className="col s6">
         <table className="chart-table">
          <thead>
            <tr>
                <th data-field="activity">Activity</th>
                <th data-field="total">Total (hr)</th>
                <th data-field="day">Day (hr)</th>
                <th data-field="night">Night (hr)</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.getIn(['data', 'activities']).map(h =>
              <tr key={h.get('name')}>
                <td><div className="square" style={{background: ACTIVITY_COLORS[h.get('name')]}}></div>{h.get('name')}</td>
                <td>{this.roundNumber(this.getTimeComponent(h.get('day')) + this.getTimeComponent(h.get('night')))}</td>
                <td>{this.getTimeComponent(h.get('day'))}</td>
                <td>{this.getTimeComponent(h.get('night'))}</td>
              </tr>
            )}
          </tbody>
        </table>                  
      </div>);
    }
  }

  // Get in hours for now
  // Data is specified in seconds
  getTimeComponent(value) {
    return this.roundNumber((value || 0) / 60.0 / 60.0);
  }

  roundNumber(n) {
    return Math.round(n*100)/100;
  }

  isExpanded() {
    return this.props.size === common.constants.Size.XLARGE || this.props.widthCols >= 6;
  }

  getFakeData() {
    let data = {
      "app": "ai.corva.rig_activity.rig_activity",
      "timestamp": 1474347110,
      "data": {
        "start_timestamp": 1474347110,
        "end_timestamp": 1474347110,
        "activities": [{
          "name": "Drilling Slide",
          "day": 86.1,
          "night": 43.3
        },{
          "name": "Drilling Rotary",
          "day": 76.1,
          "night": 67.3
        },{
          "name": "Connection",
          "day": 3.1,
          "night": 3.3
        },{
          "name": "Circulating",
          "day": 77.1,
          "night": 45.3
        },{
          "name": "Reaming Upwards",
          "day": 3.1,
          "night": 3.3
        },{
          "name": "Reaming Downwards",
          "day": 3.1,
          "night": 3.3
        }]
      }
    };
    data.timestamp = Math.floor(Date.now() / 1000);
    data.data.start_timestamp = Math.floor(Date.now() / 1000 - 24*60*60);
    data.data.end_timestamp = Math.floor(Date.now() / 1000);
    data.data.activities.forEach(h => {
      h.day *= Math.random()*0.2 + 0.8;
      h.night *= Math.random()*0.2 + 0.8;
    });
    return fromJS(data);
  }


  async getData() {
    // Reset state
    this.setState({
      data: null
    });
    let data = await api.getAppStorage(METADATA.provider, METADATA.collections[this.props.period], this.props.asset.get('id'), Map({
      limit: 1
    }));
    // UI is expecting single item, but API returns array
    if(data) {
      data = data.get(0);
    }
    //data = this.getFakeData();
    this.setState({
      data: data
    });
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

  getGraphData(shift) {
    return this.state.data
    .getIn(['data', 'activities'])
    .map(h => ({
      "name": h.get('name'),
      "y": this.roundNumber(shift === 'combined' ? (this.getTimeComponent(h.get('day')) + this.getTimeComponent(h.get('night'))) : this.getTimeComponent(h.get(shift))),
      "color": ACTIVITY_COLORS[h.get('name')]
    }));
  }

  renderCombinedChart() {
    return <PieChart
      data={this.getGraphData('combined')}
      title='Combined'
      titleAlign='left'
      titleVerticalAlign='bottom'
      showTooltipInPercentage={this.showTooltipInPercentage()}
      unit={this.getDisplayUnit()}
      size={this.props.size}
      showLegend={false}
      name='Rig Activity'>
    </PieChart>;
  }

  renderNightChart() {
    return <PieChart
      data={this.getGraphData('night')}
      title='Night'
      titleAlign='right'
      titleVerticalAlign='bottom'
      titleFontSize='12px'
      showTooltipInPercentage={this.showTooltipInPercentage()}
      unit={this.getDisplayUnit()}
      size={this.props.size}  
      showLegend={false}    
      name='Rig Activity'>
    </PieChart>;
  }

  renderDayChart() {
    return <PieChart
      data={this.getGraphData('day')}
      title='Day'
      titleAlign='right'
      titleVerticalAlign='top'
      titleFontSize='12px'
      showTooltipInPercentage={this.showTooltipInPercentage()}
      unit={this.getDisplayUnit()}
      size={this.props.size}   
      showLegend={false}   
      name='Rig Activity'>
    </PieChart>;
  }
 
  showTooltipInPercentage() {
    return this.props.displayFormat === 'percent';
  }

  getDisplayUnit() {
    return this.props.displayFormat === 'percent' ? '%' : 'hr';
  }
}

RigActivityApp.propTypes = {
  data: ImmutablePropTypes.map,
  period: PropTypes.number,
  displayFormat: PropTypes.string,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

RigActivityApp.defaultProps = {
  period: PERIOD_TYPES[0].value,
  displayFormat: DISPLAY_FORMATS[0].value,
};

export default RigActivityApp;
