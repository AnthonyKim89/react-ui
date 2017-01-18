import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find } from 'lodash';
import numeral from 'numeral';

import { SUPPORTED_TRACES } from './constants';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './SingleTraceApp.css'

class SingleTraceApp extends Component {

  render() {
    return (
      <div className="c-trace-single">
        <h3>{this.getTrace().label}</h3>
        {this.getLatestTrace() ?
          this.renderLatestTrace() :
          <LoadingIndicator />}
      </div>
    );
  }

  renderLatestTrace() {
    return (
      <div className="c-trace-single__latest">
        <span className="c-trace-single__latest__value">
          {this.getLatestTrace()}
        </span>
        <span className="c-trace-single__latest__unit">
          {this.getTrace().unit}
        </span>
      </div>
    );
  }

  getTrace() {
    return find(SUPPORTED_TRACES, {trace: this.props.trace}) || {};
  }

  getLatestTrace() {
    return this.props.data && this.props.data.has('wits/raw') ?
      numeral(this.props.data.getIn(['wits/raw', this.props.trace])).format('0.0a') :
      null;
  }

}

SingleTraceApp.propTypes = {
  data: ImmutablePropTypes.map,
  trace: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default SingleTraceApp;
