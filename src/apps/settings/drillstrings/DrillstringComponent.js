import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Input } from 'react-materialize';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import uuidV1 from 'uuid/v1';

import DrillstringComponentSchematic from './DrillstringComponentSchematic';
import DrillstringComponentEditorItem from './DrillstringComponentEditorItem';

import './DrillstringComponentTable.css';

class DrillstringComponent extends Component {
	render() {
    return <div className="c-drillstring-component">
      {this.props.isEditable && this.props.errors && this.props.errors["bit_count"] ?
        <div style={{color:'red'}}>
          { this.props.errors["bit_count"] }
        </div> : ''
      }
      <Row>
        <Col m={1}>
          <DrillstringComponentSchematic
            drillstring={this.props.record}
            isEditable={this.props.isEditable}
            onReorderComponents={this.onReorderComponents.bind(this)} />
        </Col>
        <Col m={11}>
          {this.props.record.getIn(['data', 'components'], List()).map((cmp, idx) => 
            <DrillstringComponentEditorItem
              convert={this.props.convert}
              key={idx}
              index={idx}
              component={cmp}
              errors={this.props.errors && this.props.errors["components"]? this.props.errors["components"][idx]: null}
              isEditable={this.props.isEditable}
              onSave={this.props.onSave}
              onComponentFieldChange={(field, value) => this.onComponentFieldChange(idx, field, value)}/>
              
          )}
        </Col>
      </Row>
      <Row>
        <Col m={1}></Col>
        <Col m={11}>
          {this.props.isEditable &&
            <Button floating icon="add" onClick={() => this.onAddComponent()}></Button>}
        </Col>
      </Row>
    </div>;
	}

  onAddComponent() {
    const newComponent = Map({
      id: uuidV1(),
      family: 'dp',
      order: this.props.record.getIn(['data', 'components']).size
    });
    this.props.onUpdateRecord(this.props.record.updateIn(['data', 'components'], c => c.push(newComponent)));
  }

  onComponentFieldChange(idx, name, value) {
    this.props.onUpdateRecord(this.props.record.setIn(['data', 'components', idx, name], value));
  }
  
  onReorderComponents(newComponents) {
    const withNewIndexes = newComponents.map((comp, idx) => comp.set('order', idx));
    this.props.onUpdateRecord(this.props.record.setIn(['data', 'components'], withNewIndexes));
  }
}

DrillstringComponent.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onUpdateRecord: PropTypes.func
};

export default DrillstringComponent;