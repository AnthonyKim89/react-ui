import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { Input, Button, Row, Col } from 'react-materialize';
import Modal from 'react-modal';
import { SliderPicker } from 'react-color';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './TracesSettingsDialog.css';

class TracesSettingsDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      traceEditIndex: null,
    };
    this.updateTraceGraph = this.updateTraceGraph.bind(this);
  }

  render() {
    return <Modal
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
               ref={(input) => this.traceEditorInput = input}>
          <option value="">&nbsp;</option>
          {this.props.supportedTraces.map((trace, idx) => {
            return <option key={idx} value={trace.trace}>{trace.label}</option>;
          })}
        </Input>
        <SliderPicker
          ref={(input) => this.traceEditorPicker = input}
          color={this.props.traceGraphs.getIn([this.state.traceEditIndex, 'color'])} />
        <Row className="c-traces__container__edit-trace__dialog__button-row">
          <Col s={6}>
            <Button className="c-traces__container__edit-trace__dialog__done" onClick={() => this.updateTraceGraph()}>
              Save
            </Button>
          </Col>
          <Col s={6}>
            <Button className="c-dashboard-tab-bar__edit-dashboard__dialog__cancel" onClick={() => this.closeDialog()}>
              Cancel
            </Button>
          </Col>
        </Row>
      </div>}
    </Modal>;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.traceGraphs.equals(this.props.traceGraphs) ||  this.state.dialogOpen !== nextState.dialogOpen;
  }

  updateTraceGraph() {
    this.props.onSettingChange(
      'traceGraphs',
      this.props.traceGraphs.set(this.state.traceEditIndex, Map({
        trace: this.traceEditorInput.state.value,
        color: this.traceEditorPicker.state.hex,
      }))
    );
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

TracesSettingsDialog.propTypes = {
  supportedTraces: PropTypes.array.isRequired,
  traceGraphs: ImmutablePropTypes.list.isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default TracesSettingsDialog;
