import React, { Component, PropTypes } from 'react';
import { List, Range } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Row } from 'react-materialize';

import TracesChartColumn from './TracesChartColumn';
import Convert from '../../../common/Convert';
import TracesSettingsDialog from './TracesSettingsDialog';
import * as api from '../../../api';
import { isEqual } from 'lodash';

import './TracesChartContainer.css';

class TracesChartContainer extends Component {

  constructor(props) {
    super(props);
    this.openSettingsDialog = this.openSettingsDialog.bind(this);
    this.state = {
      assetList: new List(),
    };
  }

  async componentDidMount() {
    this.setState({
      assetList: await api.getAssets(),
    });
  }

  render() {
    let columnCount = this.props.traceColumnCount !== undefined ? this.props.traceColumnCount : 4;
    let columns = Array.apply(null, {length: columnCount}).map(Number.call, Number);
    return <Row s={12} className="c-traces__container">
      {columns.map((group) => (
        <TracesChartColumn
          key={group}
          data={this.props.data}
          asset={this.props.asset}
          latestData={this.props.latestData}
          traceGraphs={this.getTraceGraphGroup(group)}
          traceRowCount={this.props.traceRowCount}
          supportedTraces={this.props.supportedTraces}
          convert={this.props.convert}
          columnNumber={group}
          totalColumns={columnCount}
          includeDetailedData={this.props.includeDetailedData}
          editTraceGraph={(traceEditIndex) => this.openSettingsDialog(traceEditIndex)}
          onAppSubscribe={(...args) => this.props.onAppSubscribe(...args)}
          onAppUnsubscribe={(...args) => this.props.onAppUnsubscribe(...args)}
          widthCols={this.props.widthCols} />
      ))}
      <TracesSettingsDialog
        ref={(input) => this.traceSettingsDialog = input}
        supportedTraces={this.props.supportedTraces}
        traceGraphs={this.props.traceGraphs}
        convert={this.props.convert}
        asset={this.props.asset}
        assetList={this.state.assetList}
        params={{assetType: 'rig'}}
        location={{query: {}}}
        onSettingChange={this.props.onSettingChange} />
    </Row>;
  }

  getTraceGraphGroup(number) {
    return Range(0, this.props.traceGraphs.size, 4)
      .map(chunkStart => this.props.traceGraphs.slice(chunkStart, chunkStart + 4))
      .get(number, List());
  }

  openSettingsDialog(traceEditIndex) {
    this.traceSettingsDialog.openDialog(traceEditIndex);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.props.traceGraphs.equals(nextProps.traceGraphs)
      || (this.props.latestData && !this.props.latestData.equals(nextProps.latestValue))
      || !this.props.data.equals(nextProps.data)
      || this.props.traceRowCount !== nextProps.traceRowCount
      || this.props.traceColumnCount !== nextProps.traceColumnCount
      || !isEqual(this.state, nextState);
  }
}

TracesChartContainer.propTypes = {
  asset: ImmutablePropTypes.map,
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  supportedTraces: PropTypes.array.isRequired,
  traceGraphs: ImmutablePropTypes.list.isRequired,
  data: ImmutablePropTypes.list,
  latestData: ImmutablePropTypes.map,
  widthCols: PropTypes.number.isRequired,
  onAppUnsubscribe: PropTypes.func.isRequired,
  onAppSubscribe: PropTypes.func.isRequired,
  onSettingChange: PropTypes.func.isRequired,
  traceColumnCount: PropTypes.number,
  traceRowCount: PropTypes.number,
  includeDetailedData: PropTypes.bool,
};

export default TracesChartContainer;
