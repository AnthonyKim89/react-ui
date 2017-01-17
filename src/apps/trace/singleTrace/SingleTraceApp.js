import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Chart from '../../../common/Chart';
import ChartSeries from '../../../common/ChartSeries';
import LoadingIndicator from '../../../common/LoadingIndicator';

import './SingleTraceApp.css'

class SingleTraceApp extends Component {

  render() {
    return (
      <div className="c-trace-single">
        {this.props.data ?
          'Hi' :
          <LoadingIndicator />}
      </div>
    );
  }

}

SingleTraceApp.propTypes = {
  data: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default SingleTraceApp;
