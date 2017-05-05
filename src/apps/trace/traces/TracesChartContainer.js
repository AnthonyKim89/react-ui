import React, { Component, PropTypes } from 'react';
import { List, Range } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import TracesChartColumn from './TracesChartColumn';

import './TracesChartContainer.css';

class TracesChartContainer extends Component {

  render() {
    return <div className="c-traces__container">
      {[0,1,2,3].map((group) => (
        <TracesChartColumn
          key={group}
          data={this.props.data}
          traceGraphs={this.getTraceGraphGroup(group)}
          supportedTraces={this.props.supportedTraces}
          widthCols={this.props.widthCols} />
      ))}
    </div>;
  }

  getTraceGraphGroup(number) {
    return Range(0, this.props.traceGraphs.size, 3)
      .map(chunkStart => this.props.traceGraphs.slice(chunkStart, chunkStart + 3))
      .get(number, List());
  }
}

TracesChartContainer.propTypes = {
  supportedTraces: PropTypes.array.isRequired,
  traceGraphs: ImmutablePropTypes.list.isRequired,
  data: ImmutablePropTypes.list.isRequired,
  widthCols: PropTypes.number.isRequired,
};

export default TracesChartContainer;
