import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Row, Col, Button, Icon } from 'react-materialize';
import { find, isEqual } from 'lodash';
import Modal from 'react-modal';

import Convert from '../../../common/Convert';

import './TracesBoxColumn.css';

class TracesBoxColumn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editDialogOpen: false,
      deleteDialogOpen: false,
      traceEditIndex: null,
      updatedUnitType: null,
    };
  }

  render() {
    let shouldDisplayUnitOptions = this.shouldDisplayUnitOptions();
    
    let applicableUnits = [];
    if (shouldDisplayUnitOptions) {
      let defaultUnitType = this.props.traceBoxes.getIn([this.state.traceEditIndex, 'unitType']);
      if (this.state.updatedUnitType !== null) {
        applicableUnits = this.props.convert.getUnitsByType(this.state.updatedUnitType);
      } else if (defaultUnitType !== undefined) {
        applicableUnits = this.props.convert.getUnitsByType(defaultUnitType);
      }
    }
    
    return <div className="c-traces__box-column">
      {this.getBoxData().map((trace, idx) => {
        return <Row key={idx} s={12} className="c-traces__box-column__box-row">
          <Col s={12}>
            {trace.label}<br/>
            <span className="c-traces__box-column__box-row__value">{trace.value.formatNumeral("0.0")}</span><br/>
            {trace.display}
          </Col>
          <div className="c-traces__box-column__box-row__x" onClick={() => this.openDeleteDialog(idx)}><Icon>clear</Icon></div>
        </Row>;
      })}
      <Button className="black white-text" waves='light' onClick={() => this.openEditDialog()}>+</Button>

      <Modal
        width='400px'
        isOpen={this.state.editDialogOpen}
        onRequestClose={() => this.closeDialogs()}
        className="c-traces__box-column__edit-trace"
        overlayClassName='c-traces__box-column__edit-trace__overlay'
        contentLabel="Trace Graph">
        {this.state.editDialogOpen && // We don't want to render this at all if it's not even open, especially with all the re-renders happening here.
        <div className="c-traces__box-column__edit-trace__dialog">
          <header>
            <h4 className="c-traces__box-column__edit-trace__dialog__title">
              Trace Graph
            </h4>
          </header>

          <div className="c-traces__box-column__edit-trace__form">

            <Input type='select' label="Trace" s={12}
                   defaultValue={this.props.traceBoxes.getIn([this.state.traceEditIndex, 'trace'])}
                   ref={(input) => this.traceEditorGraph = input}>
              <option value="">&nbsp;</option>
              {this.props.supportedTraces.map((trace, idx) => {
                return <option key={idx} value={trace.trace}>{trace.label}</option>;
              })}
            </Input>

            {shouldDisplayUnitOptions && <Input type='select' label="Unit Type" s={12}
                   defaultValue={this.props.traceBoxes.getIn([this.state.traceEditIndex, 'unitType'])}
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
            </Input>}

            {shouldDisplayUnitOptions && <Input type='select' label="Convert From" s={12}
                   defaultValue={this.props.traceBoxes.getIn([this.state.traceEditIndex, 'unitFrom'])}
                   ref={(input) => this.traceEditorUnitFrom = input}>
              <option value="">&nbsp;</option>
              {applicableUnits.map((unit, idx) => {
                return <option key={idx} value={unit.abbr}>{unit.display}</option>;
              })}
            </Input>}

            {shouldDisplayUnitOptions && <Input type='select' label="Convert To" s={12}
                   defaultValue={this.props.traceBoxes.getIn([this.state.traceEditIndex, 'unitTo'])}
                   ref={(input) => this.traceEditorUnitTo = input}>
              <option value="">&nbsp;</option>
              {applicableUnits.map((unit, idx) => {
                return <option key={idx} value={unit.abbr}>{unit.display}</option>;
              })}
            </Input>}

          </div>

          <Row className="c-traces__box-column__edit-trace__dialog__button-row">
            <Col s={6}>
              <Button className="c-traces__box-column__edit-trace__dialog__done" onClick={() => this.deleteTraceBox()}>
                Save
              </Button>
            </Col>
            <Col s={6}>
              <Button className="c-traces__box-column__edit-trace__dialog__cancel" onClick={() => this.closeDialogs()}>
                Cancel
              </Button>
            </Col>
          </Row>
        </div>}
      </Modal>

      <Modal
        width='400px'
        isOpen={this.state.deleteDialogOpen}
        onRequestClose={() => this.closeDialogs()}
        className="c-traces__box-column__edit-trace"
        overlayClassName='c-traces__box-column__edit-trace__overlay'
        contentLabel="Trace Graph">
        {this.state.deleteDialogOpen && // We don't want to render this at all if it's not even open, especially with all the re-renders happening here.
        <div className="c-traces__box-column__edit-trace__dialog">
          Are you sure you want to delete this Trace Box?

          <Row className="c-traces__box-column__edit-trace__dialog__button-row">
            <Col s={6}>
              <Button className="c-traces__box-column__edit-trace__dialog__done" onClick={() => this.saveTraceBox()}>
                Save
              </Button>
            </Col>
            <Col s={6}>
              <Button className="c-traces__box-column__edit-trace__dialog__cancel" onClick={() => this.closeDialogs()}>
                Cancel
              </Button>
            </Col>
          </Row>
        </div>}
      </Modal>
    </div>;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.traceBoxes.equals(this.props.traceBoxes) ||  !isEqual(this.state, nextState);
  }

  shouldDisplayUnitOptions() {
    let currentTrace = this.props.traceBoxes.getIn([this.state.traceEditIndex, 'trace']);
    let traceMeta = find(this.props.supportedTraces, {trace: currentTrace});
    if (!traceMeta) {
      return false;
    }

    if (!traceMeta.hasOwnProperty('unitType')) {
      return true;
    }
  }

  openEditDialog(traceEditIndex = null) {
    this.setState({
      editDialogOpen: true,
      deleteDialogOpen: false,
      traceEditIndex: traceEditIndex,
      updatedUnitType: null,
    });
  }

  closeDialogs() {
    this.setState({
      editDialogOpen: false,
      deleteDialogOpen: false,
      traceEditIndex: null,
      updatedUnitType: null,
    });
  }
  
  openDeleteDialog(traceEditIndex) {
    this.setState({
      editDialogOpen: false,
      deleteDialogOpen: true,
      traceEditIndex: traceEditIndex,
      updatedUnitType: null,
    });
  }

  deleteTraceBox() {

  }

  getBoxData() {
    let boxes = this.props.traceBoxes.map(traceEntry => {
      let traceMeta = find(this.props.supportedTraces, {trace: traceEntry.get("trace")});
      if (!traceMeta) {
        return null;
      }

      let box = {
        label: traceMeta.label,
        value: this.props.data.getIn(['data', traceEntry.get('trace')]),
        display: "",
      };

      let unitType = traceEntry.get('unitType');
      let unitTo = traceEntry.get('unitTo', null);

      if (unitType === undefined) {
        if (traceMeta.hasOwnProperty('unitType')) {
          unitType = traceMeta.unitType;
        } else if (traceMeta.hasOwnProperty('unit')) {
          box.display = traceMeta.unit;
          return box;
        } else {
          return box;
        }
      }

      if (unitTo === null) {
        if (traceMeta.hasOwnProperty('cuit')) {
          unitTo = traceMeta.cunit;
        }
      }

      box.display = this.props.convert.getUnitDisplay(unitType, unitTo);

      return box;
    });

    return boxes.filter(value => value !== null);
  };
}

TracesBoxColumn.propTypes = {
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  supportedTraces: PropTypes.array.isRequired,
  data: ImmutablePropTypes.map.isRequired,
  onSettingChange: PropTypes.func.isRequired,
  traceBoxes: ImmutablePropTypes.list.isRequired,
};

export default TracesBoxColumn;
