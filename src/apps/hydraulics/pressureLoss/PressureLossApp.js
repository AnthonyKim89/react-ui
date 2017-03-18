import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, ACTIVITY_COLORS } from './constants';
import PieChart from '../../../common/PieChart';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './PressureLossApp.css'

const pieOptions = {
  innerSize: '33%',
};

class PressureLossApp extends Component {

  render() {
    return (
      this.getData() ?
        <div className="c-hydraulics-pressure-loss">
          <div className="row chart-panel">
            <div className="col s12">
              {this.renderChart()}
            </div>
          </div>
        </div> :
        <LoadingIndicator />
    );
  }

  getData() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  getGraphData(shift) {
    return this.getData()
    .getIn(['data', 'activities'])
    .map(h => ({
      "name": h.get('name'),
      "y": shift === 'combined' ? h.get('day') + h.get('night') : h.get(shift),
      "color": ACTIVITY_COLORS[h.get('name')]
    }));
  }

  renderChart() {
    return <PieChart
      data={this.getGraphData('combined')}
      showTooltipInPercentage={this.showTooltipInPercentage()}
      unit={this.getDisplayUnit()}
      pieOptions={pieOptions}
      name='Pressure Loss'>
    </PieChart>;
  }

  showTooltipInPercentage() {
    return this.props.displayFormat === 'percent';
  }

  getDisplayUnit() {
    return this.props.displayFormat === 'percent' ? '%' : 'hr';
  }
}

PressureLossApp.propTypes = {
  data: ImmutablePropTypes.map,
  period: PropTypes.number,
  displayFormat: PropTypes.string,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default PressureLossApp;
