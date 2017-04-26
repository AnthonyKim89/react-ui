import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import ObjectGraph from '../../../common/ObjectGraph';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './MSEVDepthApp.css';

class MSEVDepthApp extends Component {

  render() {
    return (
      <div className="c-de-mse-v-depth">
        {subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS) ?
          <ObjectGraph  series={this.getSeries()} 
                        size={this.props.size}
                        coordinates={this.props.coordinates}
                        yAxisTitle={{text:`Pressure (${this.props.convert.getUnitDisplay('pressure')})`, style: { color: "#fff" }}}
                        xAxisTitle={{text:`Measure Depth (${this.props.convert.getUnitDisplay('length')})`, style: { color: "#fff" }}}
                        inverted={true} 
                        marginBottom={80}
                        legend={{
                          align: 'bottom',
                          verticalAlign: 'bottom',
                          layout: 'horizontal',
                          itemStyle: {color: '#fff'},
                          itemHoverStyle: {color: '#58c9c2'},
                          enabled: true,
                          y: 15
                        }}
                        xAxisLabelFormatter={this.formatYLabel()} /> :
          <LoadingIndicator />}
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || nextProps.coordinates !== this.props.coordinates || nextProps.graphColors !== this.props.graphColors);
  }

  formatYLabel() {
    let unit = this.props.convert.getUnitDisplay('length');
    return (
      function() {
        return '<span class="c-de-mse-v-depth-x-label">' + this.value + '</span>' + unit;
      }
    );
  }

  getSeries() {
    let series = [];
    for (let prop in SUPPORTED_CHART_SERIES) {
      if (SUPPORTED_CHART_SERIES.hasOwnProperty(prop)) {
        var s = this.getDataSeries(prop);
        if(s) {
          series.push(s);
        }
      }
    }
    return series;
  }

  getDataSeries(field) {
    let rawData = subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS).getIn(['data', field]);
    if (!rawData) return null;    
    let subtype = SUPPORTED_CHART_SERIES[field].subType;
    let unitType = SUPPORTED_CHART_SERIES[field].unitType;
    let unit = SUPPORTED_CHART_SERIES[field].unit;
    let processedData = [];
    rawData.valueSeq().forEach((value) => {
      processedData.push([
        value.get("measured_depth"),
        value.get(subtype)
      ]);
    });

    // Measured Depth is in index 0
    processedData = this.props.convert.convertArray(processedData, 0, 'length', 'ft');

    if (unitType) {
      processedData = this.props.convert.convertArray(processedData, 1, unitType, unit);
    }

    return {
      name: SUPPORTED_CHART_SERIES[field].label,
      data: processedData,
      color: this.getSeriesColor(field),
      animation: false
    };
  }

  getSeriesColor(field) {
    if (this.props.graphColors && this.props.graphColors.has(field)) {
      return this.props.graphColors.get(field);
    }
    return SUPPORTED_CHART_SERIES[field].defaultColor;
  }

}

MSEVDepthApp.propTypes = {
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  coordinates: PropTypes.object.isRequired,
};

export default MSEVDepthApp;
