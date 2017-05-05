import React, { Component, PropTypes } from 'react';
import { List, Range } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Button } from 'react-materialize';
import Modal from 'react-modal';

import TracesChartColumn from './TracesChartColumn';
import Convert from '../../../common/Convert';
import { MaterialPicker } from 'react-color';

import './TracesChartContainer.css';

class TracesChartContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      traceEditIndex: null,
    };
    this.updateTraceGraph = this.updateTraceGraph.bind(this);
  }

  render() {
    return <div className="c-traces__container">
      {[0,1,2,3].map((group) => (
        <TracesChartColumn
          key={group}
          data={this.props.data}
          traceGraphs={this.getTraceGraphGroup(group)}
          supportedTraces={this.props.supportedTraces}
          convert={this.props.convert}
          columnNumber={group}
          editTraceGraph={(traceEditIndex) => this.openDialog(traceEditIndex)}
          widthCols={this.props.widthCols} />
      ))}
      <Modal
        isOpen={this.state.dialogOpen}
        onRequestClose={() => this.closeDialog()}
        className='c-traces__container__edit-trace'
        overlayClassName='c-traces__container__edit-trace__overlay'
        contentLabel="Trace Graph">
        {this.state.dialogOpen && // We don't want to render this at all if it's not even open, especially with all the re-renders happening here.
        <div className="c-traces__container__edit-trace__dialog">
          <header>
            <h4 className="c-traces__container__edit-trace__dialog__title">
              Trace Graph
            </h4>
          </header>
          <Input type='select' label="Trace"
                 defaultValue={this.props.traceGraphs.getIn([this.state.traceEditIndex, 'trace'])}
                 ref={(input) => this.traceChooserInput = input}>
            {this.props.supportedTraces.map((trace, idx) => {
              return <option key={idx} value={trace.trace}>{trace.label}</option>;
            })}
          </Input>
          <MaterialPicker color={this.props.traceGraphs.getIn([this.state.traceEditIndex, 'color'])} />
          <Button className="c-traces__container__edit-trace__dialog__done" onClick={() => this.saveTrace()}>
            Save
          </Button>
          <Button className="c-traces__container__edit-trace__dialog__done" onClick={() => this.clearTrace()}>
            Clear
          </Button>
        </div>}
      </Modal>
    </div>;
  }

  getTraceGraphGroup(number) {
    return Range(0, this.props.traceGraphs.size, 3)
      .map(chunkStart => this.props.traceGraphs.slice(chunkStart, chunkStart + 3))
      .get(number, List());
  }

  updateTraceGraph() {
    this.closeDialog();
  }

  openDialog(traceEditIndex) {
    this.setState({
      dialogOpen: true,
      traceEditIndex: traceEditIndex,
    });
  }

  closeDialog() {
    this.setState({
      dialogOpen: false
    });
  }
}

TracesChartContainer.propTypes = {
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  supportedTraces: PropTypes.array.isRequired,
  traceGraphs: ImmutablePropTypes.list.isRequired,
  data: ImmutablePropTypes.list.isRequired,
  widthCols: PropTypes.number.isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default TracesChartContainer;
