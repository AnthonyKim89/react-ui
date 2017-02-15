import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './DrillstringEditor.css';

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
    return [
      <Row key="attributes1">
        <Col md={2}>Drillstring/BHA Number</Col>
        <Col md={2}>
          <input
            required
            type="number"
            min="1"
            step="1"
            value={this.getAttr('id', '')}
            onChange={e => this.updateAttr('id', parseInt(e.target.value, 10))} />
        </Col>
        <Col md={2}>Is for Planning?</Col>
        <Col md={2}>
          <input
            type="checkbox"
            checked={this.getAttr('planning', false)}
            onChange={e => this.updateAttr('planning', e.target.checked)} />
        </Col>
      </Row>,
      <Row key="attributes2">
        <Col md={2}>Depth In</Col>
        <Col md={2}>
          <input
            type="number"
            value={this.getAttr('start_depth', 0)}
            onChange={e => this.updateAttr('start_depth', parseFloat(e.target.value))} />
        </Col>
        <Col md={2}>Depth Out</Col>
        <Col md={2}>
          <input
            type="number"
            value={this.getAttr('end_depth', 0)}
            onChange={e => this.updateAttr('end_depth', parseFloat(e.target.value))} />
        </Col>
      </Row>,
      <Row key="attributes3">
        <Col md={2}>Time In</Col>
        <Col md={2}>
          <input
            type="number"
            value={this.getAttr('start_timestamp', 0)}
            onChange={e => this.updateAttr('start_timestamp', parseInt(e.target.value, 10))} />
        </Col>
        <Col md={2}>Time Out</Col>
        <Col md={2}>
          <input
            type="text"
            value={this.getAttr('end_timestamp', 0)}
            onChange={e => this.updateAttr('end_timestamp', parseInt(e.target.value, 10))} />
        </Col>
      </Row>
    ];
  }

  renderActions() {
    return <Row>
      <Col md={12}>
        <Button onClick={() => this.props.onSave(this.state.drillstring)}
                disabled={!this.isValid()}>
          Save
        </Button>
        or
        <Button bsStyle="link" onClick={() => this.props.onCancel()}>
          Cancel
        </Button>
      </Col>
    </Row>;
  }

  getAttr(name, notSetValue) {
    return this.state.drillstring.getIn(['data', name], notSetValue);
  }

  updateAttr(name, value) {
    this.setState({
      drillstring: this.state.drillstring.setIn(['data', name], value)
    });
  }

  isValid() {
    return this.getAttr('id');
  }

}

DrillstringEditor.propTypes = {
  drillstring: ImmutablePropTypes.map.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default DrillstringEditor;