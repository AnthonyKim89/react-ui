import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import LoadingIndicator from '../../../common/LoadingIndicator';
import PieChart from '../../../common/PieChart';
import subscriptions from '../../../subscriptions';

import { COLORS, LABELS, PIE_OPTIONS, SUBSCRIPTIONS } from './constants';
import './PressureLossApp.css'

class PressureLossApp extends Component {

  render() {
    return (
      this.data ?
        <div className="c-hydraulics-pressure-loss">
          <div className="row chart-panel">
            <div className="col s12">
              <PieChart
                data={this.graphData}
                showTooltipInPercentage={this.showTooltipInPercentage()}
                unit={this.displayUnit}
                pieOptions={PIE_OPTIONS}
                name='Pressure Loss'>
              </PieChart>
            </div>
          </div>
        </div> :
        <LoadingIndicator />
    );
  }

  get data() {
    return subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
  }

  get graphData() {
    return this.data
      .getIn(['data', 'percentages'])
      .map(datum => ({
        name: LABELS[datum.get('type')],
        y: datum.get('pressure_loss'),
        color: COLORS[datum.get('type')]
      }));
  }

  showTooltipInPercentage() {
    return this.props.displayFormat === 'percent';
  }

  get displayUnit() {
    return this.showTooltipInPercentage() ? '%' : ' PSI';
  }
}

PressureLossApp.propTypes = {
  data: ImmutablePropTypes.map,
  displayFormat: PropTypes.string,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default PressureLossApp;
