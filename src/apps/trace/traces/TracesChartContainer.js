import React, { Component, PropTypes } from 'react';
import { List, Range } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Row } from 'react-materialize';

import TracesChartColumn from './TracesChartColumn';
import Convert from '../../../common/Convert';
import TracesSettingsDialog from './TracesSettingsDialog';

import './TracesChartContainer.css';

class TracesChartContainer extends Component {

  constructor(props) {
    super(props);
    this.openSettingsDialog = this.openSettingsDialog.bind(this);
  }

  render() {
    return <Row s={12} className="c-traces__container">
      {[0,1,2].map((group) => (
        <TracesChartColumn
          key={group}
          data={this.props.data}
          latestData={this.props.latestData}
          traceGraphs={this.getTraceGraphGroup(group)}
          supportedTraces={this.props.supportedTraces}
          convert={this.props.convert}
          columnNumber={group}
          totalColumns={3}
          editTraceGraph={(traceEditIndex) => this.openSettingsDialog(traceEditIndex)}
          widthCols={this.props.widthCols} />
      ))}
      <TracesSettingsDialog
        ref={(input) => this.traceSettingsDialog = input}
        supportedTraces={this.props.supportedTraces}
        traceGraphs={this.props.traceGraphs}
        convert={this.props.convert}
        onSettingChange={this.props.onSettingChange} />
    </Row>;
  }

  getTraceGraphGroup(number) {
    return Range(0, this.props.traceGraphs.size, 3)
      .map(chunkStart => this.props.traceGraphs.slice(chunkStart, chunkStart + 3))
      .get(number, List());
  }

  openSettingsDialog(traceEditIndex) {
    this.traceSettingsDialog.openDialog(traceEditIndex);
  }
}

TracesChartContainer.propTypes = {
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  supportedTraces: PropTypes.array.isRequired,
  traceGraphs: ImmutablePropTypes.list.isRequired,
  data: ImmutablePropTypes.list.isRequired,
  latestData: ImmutablePropTypes.map.isRequired,
  widthCols: PropTypes.number.isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default TracesChartContainer;
