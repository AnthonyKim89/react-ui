import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import common from '../../../common';
import TraceTimeline from './TraceTimeline';
import MultiTraceApp from '../multiTrace/MultiTraceApp';

import './TraceTabApp.css'

class TraceTabApp extends Component {

  render() {
    return <div className="c-trace-tab">
      <div className="c-trace-tab__timeline">
        <TraceTimeline data={this.props.data} />
      </div>
      {this.renderColumn('weight_on_bit', 'hook_load', 'rotary_rpm')}
      {this.renderColumn('rotary_torque', 'rop', 'rop_average')}
      {this.renderColumn('mud_flow_in', 'mud_flow_out', 'mud_flow_out_percentage')}
      {this.renderColumn('standpipe_pressure', 'pump_spm_total', 'mud_volume')}
    </div>;
  }

  renderColumn(trace1, trace2, trace3) {
    return <div className="c-trace-tab__trace">
      <MultiTraceApp data={this.props.data}
                          trace1={trace1}
                          trace2={trace2}
                          trace3={trace3}
                          size={common.constants.Size.SMALL}
                          widthCols={3}>
      </MultiTraceApp>
    </div>;
  }

}

TraceTabApp.propTypes = {
  data: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired
};

export default TraceTabApp;
