import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Row, Col, Button, Icon } from 'react-materialize';
import { find, isEqual } from 'lodash';
import Modal from 'react-modal';
import { fromJS } from 'immutable';

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
    this.saveTraceBox = this.saveTraceBox.bind(this);
  }

  render() {
    let applicableUnits = [];
    if (this.state.updatedUnitType !== null) {
      applicableUnits = this.props.convert.getUnitsByType(this.state.updatedUnitType);
    } else if (this.state.traceEditIndex !== null && this.props.traceBoxes.getIn([this.state.traceEditIndex, 'unitType'])) {
      applicableUnits = this.props.convert.getUnitsByType(this.props.traceBoxes.getIn([this.state.traceEditIndex, 'unitType']));
    }

    return <div className="c-traces__box-column">
      {this.getBoxData().map((trace, idx) => {
        return <Row key={idx} s={12} className="c-traces__box-column__box-row">
          <Col s={12} onClick={() => this.openEditDialog(idx)}>
            <span className="c-traces__box-column__box-row-title">{trace.label}</span><br/>
            <span className="c-traces__box-column__box-row-value">{trace.value.formatNumeral("0,0.00")}</span><br/>
            <span className="c-traces__box-column__box-row-unit">{trace.display}</span>
          </Col>
          <div className="c-traces__box-column__box-row__x" onClick={() => this.openDeleteDialog(idx)}><Icon>clear</Icon></div>
        </Row>;
      })}
      <Button className="c-traces__box-column__box-row-add-button white-text" waves='light' onClick={() => this.openEditDialog()}>+</Button>

      <Modal
        width='400px'
        isOpen={this.state.editDialogOpen}
        onRequestClose={() => this.closeDialogs()}
        className="c-traces__box-column__edit-trace"
        overlayClassName='c-traces__box-column__edit-trace__overlay'
        contentLabel="Add Trace Box">
        {this.state.editDialogOpen && // We don't want to render this at all if it's not even open, especially with all the re-renders happening here.
        <div className="c-traces__box-column__edit-trace__dialog">
          <header>
            <h4 className="c-traces__box-column__edit-trace__dialog__title">
              Add Trace Box
            </h4>
          </header>

          <div className="c-traces__box-column__edit-trace__form">

            <Input type='select'
                   label="Trace"
                   s={12}
                   defaultValue={this.props.traceBoxes.getIn([this.state.traceEditIndex, 'trace'], null)}
                   ref={(input) => this.traceInputChoice = input}>
              <option value="">&nbsp;</option>
              {this.props.supportedTraces.map((trace, idx) => {
                return <option key={idx} value={trace.trace}>{trace.label}</option>;
              })}
            </Input>

            <Input type='select'
                   label="Unit Type (optional)"
                   s={12}
                   defaultValue={this.props.traceBoxes.getIn([this.state.traceEditIndex, 'unitType'], null)}
                   onChange={(e) => this.setState({updatedUnitType: e.currentTarget.value})}
                   ref={(input) => this.traceInputUnitType = input}>
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

            <Input type='select'
                   label="Convert From (optional)"
                   s={12}
                   defaultValue={this.props.traceBoxes.getIn([this.state.traceEditIndex, 'unitFrom'], null)}
                   ref={(input) => this.traceInputUnitFrom = input}>
              <option value="">&nbsp;</option>
              {applicableUnits.map((unit, idx) => {
                return <option key={idx} value={unit.abbr}>{unit.display}</option>;
              })}
            </Input>

            <Input type='select'
                   label="Convert To (optional)"
                   s={12}
                   defaultValue={this.props.traceBoxes.getIn([this.state.traceEditIndex, 'unitTo'], null)}
                   ref={(input) => this.traceInputUnitTo = input}>
              <option value="">&nbsp;</option>
              {applicableUnits.map((unit, idx) => {
                return <option key={idx} value={unit.abbr}>{unit.display}</option>;
              })}
            </Input>

          </div>

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

      <Modal
        width='400px'
        isOpen={this.state.deleteDialogOpen}
        onRequestClose={() => this.closeDialogs()}
        className="c-traces__box-column__edit-trace"
        overlayClassName='c-traces__box-column__edit-trace__overlay'
        contentLabel="Delete Trace Box?">
        {this.state.deleteDialogOpen && // We don't want to render this at all if it's not even open, especially with all the re-renders happening here.
        <div className="c-traces__box-column__edit-trace__dialog">
          Are you sure you want to delete this Trace Box?
          <Row className="c-traces__box-column__edit-trace__dialog__button-row">
            <Col s={6}>
              <Button className="c-traces__box-column__edit-trace__dialog__done" onClick={() => this.deleteTraceBox()}>
                Delete
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

  openEditDialog(traceEditIndex=null) {
    this.setState({
      editDialogOpen: true,
      deleteDialogOpen: false,
      traceEditIndex,
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
    this.props.onSettingChange('traceBoxes', this.props.traceBoxes.delete(this.state.traceEditIndex));
    this.closeDialogs();
  }

  saveTraceBox() {
    if (!this.traceInputChoice.selectInput.value) {
      return;
    }

    let newTrace = {
      trace: this.traceInputChoice.selectInput.value,
    };

    if (this.traceInputUnitType.state.value) {
      newTrace.unitType = this.traceInputUnitType.state.value;
    }

    if (this.traceInputUnitFrom.state.value) {
      newTrace.unitFrom = this.traceInputUnitFrom.state.value;
    }

    if (this.traceInputUnitTo.state.value) {
      newTrace.unitTo = this.traceInputUnitTo.state.value;
    }

    // Adding vs Updating Existing.
    if (this.state.traceEditIndex) {
      let traceBoxes = this.props.traceBoxes.set(this.state.traceEditIndex, fromJS(newTrace));
      this.props.onSettingChange('traceBoxes', traceBoxes);
    } else {
      let traceBoxes = this.props.traceBoxes.push(fromJS(newTrace));
      this.props.onSettingChange('traceBoxes', traceBoxes);
    }

    this.closeDialogs();
  }

  getBoxData() {
    let boxes = this.props.traceBoxes.map(traceEntry => {
      let traceMeta = find(this.props.supportedTraces, {trace: traceEntry.get("trace")});
      if (!traceMeta) {
        return null;
      }

      let box = {
        label: traceMeta.label,
        value: this.props.data.getIn(['data', traceEntry.get('trace')], 0),
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
