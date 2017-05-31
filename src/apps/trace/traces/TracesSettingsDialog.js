import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { Input, Button, Row, Col } from 'react-materialize';
import Modal from 'react-modal';
import { SliderPicker } from 'react-color';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { find, isEqual } from 'lodash';

import './TracesSettingsDialog.css';

class TracesSettingsDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      traceEditIndex: null,
      updatedUnitType: null,
      autoScale: null,
    };
    this.updateTraceGraph = this.updateTraceGraph.bind(this);
    this.render = this.render.bind(this);
  }

  render() {
    let shouldDisplayUnitOptions = this.shouldDisplayUnitOptions();
    let shouldDisplayScalingOptions = this.shouldDisplayScalingOptions();

    let applicableUnits = [];
    if (shouldDisplayUnitOptions) {
      let defaultUnitType = this.props.traceGraphs.getIn([this.state.traceEditIndex, 'unitType']);
      if (this.state.updatedUnitType !== null) {
        applicableUnits = this.props.convert.getUnitsByType(this.state.updatedUnitType);
      } else if (defaultUnitType !== undefined) {
        applicableUnits = this.props.convert.getUnitsByType(defaultUnitType);
      }
    }

    return <Modal
      width='400px'
      isOpen={this.state.dialogOpen}
      onRequestClose={() => this.closeDialog()}
      className={'c-traces__container__edit-trace' + (shouldDisplayUnitOptions ? ' shouldDisplayUnitOptions' : '')}
      overlayClassName='c-traces__container__edit-trace__overlay'
      contentLabel="Trace Graph">
      {this.state.dialogOpen && // We don't want to render this at all if it's not even open, especially with all the re-renders happening here.
      <div className="c-traces__container__edit-trace__dialog">
        <header>
          <h4 className="c-traces__container__edit-trace__dialog__title">
            Trace Graph
          </h4>
        </header>

        <Row s={12}>
          <Col s={shouldDisplayUnitOptions ? 6 : 12}>
            <Input type='select' label="Trace" s={12}
                   defaultValue={this.props.traceGraphs.getIn([this.state.traceEditIndex, 'trace'])}
                   ref={(input) => this.traceEditorGraph = input}>
              <option value="">&nbsp;</option>
              {this.props.supportedTraces.map((trace, idx) => {
                return <option key={idx} value={trace.trace}>{trace.label}</option>;
              })}
            </Input>

            <Input type='select' label="Line Style" s={12}
                   defaultValue={this.props.traceGraphs.getIn([this.state.traceEditIndex, 'dashStyle'], 'Solid')}
                   ref={(input) => this.traceEditorDashStyle = input}>
              <option value="solid">Solid</option>
              <option value="dotted">Dotted</option>
              <option value="dashed">Dashed</option>
            </Input>

            <Input type='select' label="Line Width" s={12}
                   defaultValue={this.props.traceGraphs.getIn([this.state.traceEditIndex, 'lineWidth'], 2)}
                   ref={(input) => this.traceEditorLineWidth = input}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Input>

            <Row s={12} className="c-traces__container__edit-trace__checkboxes">
              <Col s={6}>
                <Input
                  type="checkbox"
                  label="Fill Graph"
                  className="filled-in"
                  s={12}
                  defaultValue={this.getFillGraphCheckboxValue(this.props.traceGraphs.get(this.state.traceEditIndex), true)}
                  defaultChecked={this.getFillGraphCheckboxValue(this.props.traceGraphs.get(this.state.traceEditIndex))}
                  ref={(input) => this.traceEditorType = input} />
              </Col>
              <Col s={6}>
                <Input
                  type="checkbox"
                  label="Auto Scale"
                  className="filled-in"
                  s={12}
                  onChange={(e) => this.setState({autoScale: e.currentTarget.checked})}
                  defaultValue={!shouldDisplayScalingOptions}
                  defaultChecked={shouldDisplayScalingOptions ? '' : 'checked'}
                  ref={(input) => this.traceEditorAutoScale = input} />
              </Col>
            </Row>

            {shouldDisplayScalingOptions && <Row s={12} className="c-traces__container__edit-trace__scaling-values">
              <Col s={6}>
                <Input
                  type="number"
                  label="Min Value"
                  s={12}
                  defaultValue={this.props.traceGraphs.getIn([this.state.traceEditIndex, 'minValue'], null)}
                  ref={(input) => this.traceEditorMinValue = input} />
              </Col>
              <Col s={6}>
                <Input
                  type="number"
                  label="Max Value"
                  s={12}
                  defaultValue={this.props.traceGraphs.getIn([this.state.traceEditIndex, 'maxValue'], null)}
                  ref={(input) => this.traceEditorMaxValue = input} />
              </Col>
            </Row>}

          </Col>

          {shouldDisplayUnitOptions && <Col s={6}>

            <Input type='select' label="Unit Type" s={12}
                   defaultValue={this.props.traceGraphs.getIn([this.state.traceEditIndex, 'unitType'])}
                   onChange={(e) => this.setState({updatedUnitType: e.currentTarget.value})}
                   ref={(input) => this.traceEditorUnitType = input}>
              <option value="">&nbsp;</option>
              <option value="length">Length</option>
              <option value="mass">Mass</option>
              <option value="volume">Volume</option>
              <option value="pressure">Pressure</option>
              <option value="temperature">Temperature</option>
              <option value="speed">Speed</option>
              <option value="area">Area</option>
              <option value="torque">Torque/Energy</option>
              <option value="force">Force</option>
              <option value="yp">Yield Point</option>
              <option value="density">Density</option>
              <option value="massPerLength">Mass Per Length</option>
            </Input>

            <Input type='select' label="Convert From" s={12}
                   defaultValue={this.props.traceGraphs.getIn([this.state.traceEditIndex, 'unitFrom'])}
                   ref={(input) => this.traceEditorUnitFrom = input}>
              <option value="">&nbsp;</option>
              {applicableUnits.map((unit, idx) => {
                return <option key={idx} value={unit.abbr}>{unit.display}</option>;
              })}
            </Input>

            <Input type='select' label="Convert To" s={12}
                   defaultValue={this.props.traceGraphs.getIn([this.state.traceEditIndex, 'unitTo'])}
                   ref={(input) => this.traceEditorUnitTo = input}>
              <option value="">&nbsp;</option>
              {applicableUnits.map((unit, idx) => {
                return <option key={idx} value={unit.abbr}>{unit.display}</option>;
              })}
            </Input>

          </Col>}
        </Row>

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

  shouldDisplayUnitOptions() {
    let currentTrace = this.props.traceGraphs.getIn([this.state.traceEditIndex, 'trace']);
    let traceMeta = find(this.props.supportedTraces, {trace: currentTrace});
    if (!traceMeta) {
      return false;
    }

    if (!traceMeta.hasOwnProperty('unitType')) {
      return true;
    }
  }

  shouldDisplayScalingOptions() {
    if (!this.state.traceEditIndex) {
      return false;
    }
    if (this.state.autoScale === null) {
      return !this.props.traceGraphs.get(this.state.traceEditIndex).get('autoScale', true);
    }
    return !this.state.autoScale;
  }

  getFillGraphCheckboxValue(traceGraph, asBoolean=false) {
    let currentValue = traceGraph.get('type', 'line') === 'area' ? 'checked' : '';
    if (asBoolean) {
      return (currentValue === 'checked');
    }
    return currentValue;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.traceGraphs.equals(this.props.traceGraphs) ||  !isEqual(this.state, nextState);
  }

  updateTraceGraph() {
    let updatedSettings = {
      trace: this.traceEditorGraph.state.value,
      color: this.traceEditorPicker.state.hex,
      type: this.traceEditorType.state.value === true ? 'area' : 'line',
      dashStyle: this.traceEditorDashStyle.state.value,
      lineWidth: parseInt(this.traceEditorLineWidth.state.value, 10),
      autoScale: this.traceEditorAutoScale.state.value === true,
    };

    if (!updatedSettings.autoScale) {
      let minValue = parseInt(this.traceEditorMinValue.state.value, 10);
      let maxValue = parseInt(this.traceEditorMaxValue.state.value, 10);
      if (!Number.isNaN(minValue)) {
        updatedSettings.minValue = minValue;
      }
      if (!Number.isNaN(maxValue)) {
        updatedSettings.maxValue = maxValue;
      }
    }

    if (this.shouldDisplayUnitOptions() && updatedSettings.trace !== "") {
      if (this.traceEditorUnitType.state.value !== '' && this.traceEditorUnitFrom.state.value !== '') {
        updatedSettings.unitType = this.traceEditorUnitType.state.value;
        updatedSettings.unitFrom = this.traceEditorUnitFrom.state.value;

        if (this.traceEditorUnitTo.state.value !== '') {
          updatedSettings.unitTo = this.traceEditorUnitTo.state.value;
        }
      }
    }

    this.props.onSettingChange(
      'traceGraphs',
      this.props.traceGraphs.set(this.state.traceEditIndex, Map(updatedSettings))
    );
    this.closeDialog();
  }

  openDialog(traceEditIndex) {
    this.setState({
      dialogOpen: true,
      traceEditIndex: traceEditIndex,
      updatedUnitType: null,
      autoScale: null,
    });
  }

  closeDialog() {
    this.setState({
      dialogOpen: false,
      traceEditIndex: null,
      updatedUnitType: null,
      autoScale: null,
    });
  }
}

TracesSettingsDialog.propTypes = {
  supportedTraces: PropTypes.array.isRequired,
  traceGraphs: ImmutablePropTypes.list.isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default TracesSettingsDialog;
