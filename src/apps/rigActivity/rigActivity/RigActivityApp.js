import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input } from 'react-materialize';
import { format as formatDate } from 'date-fns';

import { SUBSCRIPTIONS, ACTIVITY_COLORS, PERIOD_TYPES } from './constants';
import PieChart from '../../../common/PieChart';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './RigActivityApp.css'

class RigActivityApp extends Component {

  render() {
    return (
      this.getData() ?
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

  componentWillReceiveProps(nextProps) {
  }

  renderTable() {
    if (this.isExpanded()) {
      return (<div className="col s6">
         <table className="responsive-table chart-table">
          <thead>
            <tr>
                <th data-field="activity">Activity</th>
                <th data-field="total">Total</th>
                <th data-field="day">Day</th>
                <th data-field="night">Night</th>
            </tr>
          </thead>
          <tbody>
            {this.getData().getIn(['data', 'activities']).map(h =>
              <tr key={h.get('name')}>
                <td><div className="square" style={{background: ACTIVITY_COLORS[h.get('name')]}}></div>{h.get('name')}</td>
                <td>{this.roundNumber(h.get('day') + h.get('night'))}</td>
                <td>{this.roundNumber(h.get('day'))}</td>
                <td>{this.roundNumber(h.get('night'))}</td>
              </tr>
            )}
          </tbody>
        </table>                  
      </div>);
    }
  }

  roundNumber(n) {
    return Math.round(n*10)/10;
  }

  isExpanded() {
    return this.props.widthCols > 6;
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
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

  getGraphData(shift) {
    return this.getData()
    .getIn(['data', 'activities'])
    .map(h => ({
      "name": h.get('name'),
      "y": this.roundNumber(shift === 'combined' ? h.get('day') + h.get('night') : h.get(shift)),
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
      name='Rig Activity'>
    </PieChart>;
  }
 
  showTooltipInPercentage() {
    return this.props.displayFormat === 'percent' ? true : false;
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

export default RigActivityApp;
