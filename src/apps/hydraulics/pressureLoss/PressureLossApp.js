import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { Size } from '../../../common/constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import PieChart from '../../../common/PieChart';
import subscriptions from '../../../subscriptions';

import { COLORS, LABELS, PIE_OPTIONS, SUBSCRIPTIONS, DISPLAY_FORMATS } from './constants';

import './PressureLossApp.css';

class PressureLossApp extends Component {

  render() {
    return (
      this.data ?
        <div className="c-hydraulics-pressure-loss">
          {this.renderStatistics()}
          <div className="row chart-panel">
            <div className="col s12">
              <PieChart
                data={this.graphData}
                showTooltipInPercentage={this.showTooltipInPercentage()}
                unit={this.displayUnit}
                pieOptions={this.pieOptions}
                size={this.props.size}
                showLegend={true}
                forceLegend={true}
                name='Pressure Loss'>
              </PieChart>
            </div>
          </div>
        </div> :
        <LoadingIndicator />
    );
  }

  renderStatistics() {
    let witsData = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[1]);
    let spp = witsData ? witsData.getIn(["data", "standpipe_pressure"]) : null;
    let pressureLoss = this.data ? this.data.getIn(["data", "predicted_standpipe_pressure"]) : null;

    let difference = 0;
    if(spp && pressureLoss) {
      difference = ((pressureLoss / spp) * 100.0).formatNumeral("0.0");
    }

    spp = spp ? this.props.convert.convertValue(spp, "pressure", "psi").formatNumeral("0,0") : "-";    
    pressureLoss = pressureLoss ? this.props.convert.convertValue(pressureLoss, "pressure", "psi").formatNumeral("0,0") : "-";

    return (
      <div className="c-hydraulics-pressure-loss-statistics">
        <div className="c-hydraulics-pressure-loss-statistics__column">
          <p>Total Pressure Loss</p>
          <div className="value">
            {pressureLoss} <span>{this.props.convert.getUnitDisplay('pressure')}</span>
          </div>
          <div className="c-hydraulics-pressure-loss-statistics-difference">
            ({difference}%)
          </div>
        </div>
        <div className="c-hydraulics-pressure-loss-statistics__column">
          <p>SPP</p>
          <div className="value">
            {spp} <span>{this.props.convert.getUnitDisplay('pressure')}</span>
          </div>
        </div>
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!(
        (nextProps.data && !nextProps.data.equals(this.props.data)) ||
        (nextProps.coordinates && !nextProps.coordinates.equals(this.props.coordinates)) ||
        (nextProps.graphColors && !nextProps.graphColors.equals(this.props.graphColors))
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
        y: Number(this.props.convert.convertValue(datum.get('pressure_loss'), 'pressure', 'psi')),
        color: COLORS[datum.get('type')]
      }));
  }

  showTooltipInPercentage() {
    return this.props.displayFormat === 'percent';
  }

  get displayUnit() {
    return this.showTooltipInPercentage() ? '%' : ' ' + this.props.convert.getUnitDisplay("pressure");
  }

  /**
   * Get the pie options.
   *
   * The pie options are a combination of static and dynamic data.
   */
  get pieOptions() {
    return Object.assign(PIE_OPTIONS, {
      dataLabels: this.dataLabels,
      showInLegend: this.showInLegend
    });
  }

  /**
   * Get the data labels for larger sizes.
   *
   * Data labels get clipped at smaller sizes so only show them when displayed
   * in a larger mode.
   */
  get dataLabels() {
    if (this.showInLegend) {
      const format = this.showTooltipInPercentage() ? '{percentage:.1f}' : '{y}';
      return {
        enabled: true,
        color: '#fff',
        distance: 10,
        format: format
      };
    } else {
      return { enabled: false };
    }
  }

  /**
   * Decide when to show the legend.
   *
   * At smaller sizes, the legend would completely overlap the pie area.
   */
  get showInLegend() {
    return this.props.size === Size.LARGE || this.props.size === Size.XLARGE;
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
