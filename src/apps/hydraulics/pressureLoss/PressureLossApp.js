import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import LoadingIndicator from '../../../common/LoadingIndicator';
import PieChart from '../../../common/PieChart';
import { Size } from '../../../common/constants';
import subscriptions from '../../../subscriptions';

import { COLORS, LABELS, PIE_OPTIONS, SUBSCRIPTIONS, DISPLAY_FORMATS } from './constants';

import './PressureLossApp.css';

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
                pieOptions={this.pieOptions}
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
        y: this.props.convert.convertValue(datum.get('pressure_loss'), 'pressure', 'psi').fixFloat(1),
        color: COLORS[datum.get('type')]
      }));
  }

  showTooltipInPercentage() {
    return this.props.displayFormat === 'percent';
  }

  get displayUnit() {
    return this.showTooltipInPercentage() ? '%' : ' ' + this.props.convert.getUnitDisplay("pressure");
  }

  get pieOptions() {
    return Object.assign(PIE_OPTIONS, {showInLegend: this.showInLegend});
  }

  get showInLegend() {
    return this.props.size === Size.XLARGE;
  }
}

PressureLossApp.propTypes = {
  data: ImmutablePropTypes.map,
  displayFormat: PropTypes.string,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

PressureLossApp.defaultProps = {
  displayFormat: DISPLAY_FORMATS[1].value,
};

export default PressureLossApp;
