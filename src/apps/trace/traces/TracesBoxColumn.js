import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Input, Row, Col, Button } from 'react-materialize';
import { find } from 'lodash';
import Modal from 'react-modal';

import Convert from '../../../common/Convert';

import './TracesBoxColumn.css';

class TracesBoxColumn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
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
        </Row>;
      })}
      <Button className="black white-text" waves='light' onClick={() => this.openDialog()}>+</Button>

      <Modal
        width='400px'
        isOpen={this.state.dialogOpen}
        onRequestClose={() => this.closeDialog()}
        className={'c-traces__box-column__edit-trace' + (shouldDisplayUnitOptions ? ' shouldDisplayUnitOptions' : '')}
        overlayClassName='c-traces__box-column__edit-trace__overlay'
        contentLabel="Trace Graph">
        {this.state.dialogOpen && // We don't want to render this at all if it's not even open, especially with all the re-renders happening here.
        <div className="c-traces__box-column__edit-trace__dialog">
          <header>
            <h4 className="c-traces__box-column__edit-trace__dialog__title">
              Trace Graph
            </h4>
          </header>

          <Row s={12}>
            <Col s={shouldDisplayUnitOptions ? 6 : 12}>
              <Input type='select' label="Trace" s={12}
                     defaultValue={this.props.traceBoxes.getIn([this.state.traceEditIndex, 'trace'])}
                     ref={(input) => this.traceEditorGraph = input}>
                <option value="">&nbsp;</option>
                {this.props.supportedTraces.map((trace, idx) => {
                  return <option key={idx} value={trace.trace}>{trace.label}</option>;
                })}
              </Input>

            </Col>

            {shouldDisplayUnitOptions && <Col s={6}>

              <Input type='select' label="Unit Type" s={12}
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
              </Input>

              <Input type='select' label="Convert From" s={12}
                     defaultValue={this.props.traceBoxes.getIn([this.state.traceEditIndex, 'unitFrom'])}
                     ref={(input) => this.traceEditorUnitFrom = input}>
                <option value="">&nbsp;</option>
                {applicableUnits.map((unit, idx) => {
                  return <option key={idx} value={unit.abbr}>{unit.display}</option>;
                })}
              </Input>

              <Input type='select' label="Convert To" s={12}
                     defaultValue={this.props.traceBoxes.getIn([this.state.traceEditIndex, 'unitTo'])}
                     ref={(input) => this.traceEditorUnitTo = input}>
                <option value="">&nbsp;</option>
                {applicableUnits.map((unit, idx) => {
                  return <option key={idx} value={unit.abbr}>{unit.display}</option>;
                })}
              </Input>

            </Col>}
          </Row>

          <Row className="c-traces__box-column__edit-trace__dialog__button-row">
            <Col s={4}>
              <Button className="c-traces__box-column__edit-trace__dialog__done" onClick={() => this.updateTraceGraph()}>
                Save
              </Button>
            </Col>
            <Col s={4}>
              <Button className="c-traces__box-column__edit-trace__dialog__cancel" onClick={() => this.closeDialog()}>
                Delete
              </Button>
            </Col>
            <Col s={4}>
              <Button className="c-traces__box-column__edit-trace__dialog__cancel" onClick={() => this.closeDialog()}>
                Cancel
              </Button>
            </Col>
          </Row>
        </div>}
      </Modal>
    </div>;
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

  openDialog(traceEditIndex = null) {
    this.setState({
      dialogOpen: true,
      traceEditIndex: traceEditIndex,
      updatedUnitType: null,
    });
  }

  closeDialog() {
    this.setState({
      dialogOpen: false,
      traceEditIndex: null,
      updatedUnitType: null,
    });
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
