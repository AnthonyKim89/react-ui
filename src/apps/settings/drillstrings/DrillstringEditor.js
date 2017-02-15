import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { format as formatDate, parse as parseDate } from 'date-fns';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './DrillstringEditor.css';

const DATETIME_FORMAT_STRING = 'M/D/YYYY HH:mm:ss';

class DrillstringEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {drillstring: props.drillstring};
  }

  render() {
    return <div className="c-drillstring-editor">
      <Grid fluid>
        {this.renderTitle()}
        {this.renderAttributeForm()}
        {this.renderActions()}
      </Grid>
    </div>;
  }

  renderTitle() {
    if (this.props.drillstring.get('id')) {
      return <Row><Col md={12}>Edit Drillstring</Col></Row>;
    } else {
      return <Row><Col md={12}>Add New Drillstring</Col></Row>;
    }
  }

  renderAttributeForm() {
    const ds = this.state.drillstring;
    return [
      <Row key="attributes1">
        <Col md={2}>Drillstring/BHA Number</Col>
        <Col md={2}>
          <input
            type="number"
            min="1"
            step="1"
            value={ds.get('id', '')}
            onChange={e => this.updateAttr('id', parseInt(e.target.value, 10))} />
        </Col>
        <Col md={2}>Is for Planning?</Col>
        <Col md={2}>
          <input
            type="checkbox"
            checked={ds.get('planning', false)}
            onChange={e => this.updateAttr('planning', e.target.checked)} />
        </Col>
      </Row>,
      <Row key="attributes2">
        <Col md={2}>Depth In</Col>
        <Col md={2}>
          <input
            type="number"
            value={ds.get('start_depth', 0)}
            onChange={e => this.updateAttr('start_depth', parseFloat(e.target.value))} />
        </Col>
        <Col md={2}>Depth Out</Col>
        <Col md={2}>
          <input
            type="number"
            value={ds.get('end_depth', 0)}
            onChange={e => this.updateAttr('end_depth', parseFloat(e.target.value))} />
        </Col>
      </Row>,
      <Row key="attributes3">
        <Col md={2}>Time In</Col>
        <Col md={2}>
          <input
            type="text"
            value={this.getTimestampAttrValue('start_timestamp')}
            onChange={e => this.updateTimestampAttr('start_timestamp', e.target.value)} />
        </Col>
        <Col md={2}>Time Out</Col>
        <Col md={2}>
          <input
            type="text"
            value={this.getTimestampAttrValue('end_timestamp')}
            onChange={e => this.updateTimestampAttr('end_timestamp', e.target.value)} />
        </Col>
      </Row>
    ];
  }

  renderActions() {
    return <Row>
      <Col md={12}>
        <Button onClick={() => this.props.onSave(this.state.drillstring)}>Save</Button>
        or
        <Button bsStyle="link" onClick={() => this.props.onCancel()}>Cancel</Button>
      </Col>
    </Row>;
  }

  getTimestampAttrValue(attrName) {
    const unixValue = this.state.drillstring.get(attrName, Math.floor(Date.now() / 1000));
    return formatDate(new Date(unixValue * 1000), DATETIME_FORMAT_STRING);
  }

  updateTimestampAttr(attrName, formattedValue) {
    const unixValue = parseDate(formattedValue, DATETIME_FORMAT_STRING);
    if (unixValue) {
      this.updateAttr(attrName, Math.floor(unixValue / 1000));
    }
  }

  updateAttr(name, value) {
    this.setState({
      drillstring: this.state.drillstring.set(name, value)
    });
  }

}

DrillstringEditor.propTypes = {
  drillstring: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default DrillstringEditor;