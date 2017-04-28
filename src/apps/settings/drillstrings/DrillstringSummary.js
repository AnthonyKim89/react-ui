import React, { Component, PropTypes } from 'react';
import { List, Map } from 'immutable';
import { isNumber } from 'lodash';
import { Row, Col, Button } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';

import './DrillstringSummary.css';

export class DrillstringSummary extends Component {

  render() {
    return <div className="c-drillstring-summary">
      <Row>
        <Col m={2}>
          <div className="c-drillstring-summary__label">Drillstring/BHA</div>
          <div className="c-drillstring-summary__value">
            {this.props.record.getIn(['data', 'id'])}
          </div>
        </Col>
        <Col m={2}>
          <div className="c-drillstring-summary__label">Bit Size</div>
          <div className="c-drillstring-summary__value">
            {this.getBitSize()}
          </div>
        </Col>
        <Col m={2}>
          <div className="c-drillstring-summary__label">Tools</div>
          <div className="c-drillstring-summary__value">
            {this.getComponentCount()}
          </div>
        </Col>
        <Col m={2}>
          <div className="c-drillstring-summary__label">Length ({this.props.convert.getUnitDisplay('length')})</div>
          <div className="c-drillstring-summary__value c-drillstring-summary__value--is-long">
            {this.props.convert.convertValue(this.getComponentLengthSum(), 'length', 'ft').formatNumeral('0,0')}
          </div>
        </Col>
        <Col m={2}>
          <div className="c-drillstring-summary__label">Weight ({this.props.convert.getUnitDisplay('mass')})</div>
          <div className="c-drillstring-summary__value c-drillstring-summary__value--is-long">
            {this.props.convert.convertValue(this.getComponentWeightSum(), 'mass', 'lb').formatNumeral('0,0')}
          </div>
        </Col>
        <Col m={1}>
        </Col>
        <Col m={1}>
          {!this.props.isReadOnly &&
            <Button floating large icon="mode_edit" onClick={() => this.props.onEditRecord()}></Button>}
          {this.props.record.get('_id') &&
            <Button floating large icon="delete" className="red" onClick={() => this.props.onDeleteRecord()}></Button>}
        </Col>
      </Row>
      {!this.props.isReadOnly &&
        <Row>
          <Col m={2} className="c-drillstring-summary__footer-value">
            {this.getDepths()}
          </Col>
          <Col m={7} className="c-drillstring-summary__footer-value">
            {this.getTimeData()}
          </Col>
          {this.props.record.getIn(['data', 'planning']) &&
            <Col m={3} className="c-drillstring-summary__footer-value c-drillstring-summary__footer-value--planning">
              Planning Drillstring
            </Col>}
        </Row>}
    </div>;
  }

  getBitSize() {
    return this.getComponents()
      .find(c => c.get('family') === 'bit', null, Map())
      .get('size');
  }

  getComponentCount() {
    return this.getComponents().size;
  }

  getComponentLengthSum() {
    return this.getComponents()
      .map(c => c.get('length'))
      .filter(isNumber)
      .reduce((sum, length) => sum + length, 0);
  }
  
  getComponentWeightSum() {
    return this.getComponents()
      .map(c => c.get('weight'))
      .filter(isNumber)
      .reduce((sum, weight) => sum + weight, 0);
  }

  getComponents() {
    return this.props.record.getIn(['data', 'components'], List());
  }

  getDepths() {
    const start = this.props.convert.convertValue(this.props.record.getIn(['data', 'start_depth']),'length','ft').formatNumeral('0,0');
    const end = this.props.convert.convertValue(this.props.record.getIn(['data', 'end_depth']),'length','ft').formatNumeral('0,0');
    return `${start} - ${end} ${this.props.convert.getUnitDisplay('length')}`;
  }

  getTimeData() {
    let start = moment.unix(this.props.record.getIn(["data","start_timestamp"])).format('LL');
    let end = moment.unix(this.props.record.getIn(["data","end_timestamp"])).format('LL');
    return `${start} - ${end}`;
  }

  getEndDepth() {
    return this.props.record.getIn(['data', 'end_depth']);
  }

}

DrillstringSummary.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  onEditRecord: PropTypes.func,
  onDeleteRecord: PropTypes.func.isRequired
};

export default DrillstringSummary;
