import React, { Component, PropTypes } from 'react';
import { Row, Col, Button } from 'react-materialize';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import uuidV1 from 'uuid/v1';
import DraggableList from 'react-draggable-list';

import DrillstringComponentEditorItem from './DrillstringComponentEditorItem';

class DrillstringComponent extends Component {

  componentWillMount() {

    this.DrillstringComponentEditorItem = DrillstringComponentEditorItem;
  }

	render() {
    if (this.props.isEditable) {
      let commonProps = {
        convert: this.props.convert,
        errors: this.props.errors && this.props.errors["components"]? this.props.errors["components"]: null,
        onSave: this.props.onSave,      
        onComponentFieldChange: this.onComponentFieldChange.bind(this),
        onComponentMultiFieldsChange: this.onComponentMultiFieldsChange.bind(this)
      };

      return <div className="c-drillstring-component">
        <DraggableList
          list={this.getComponentArray()}
          itemKey={itm => itm.get('id')}
          template={this.DrillstringComponentEditorItem}
          padding={0}
          commonProps={commonProps}
          container={()=>document.body}
          onMoveEnd={newArr => this.onReorderComponents(List(newArr))} />
        
        <Row>
          <Col m={1}></Col>
          <Col m={11}>          
              <Button floating icon="add" onClick={() => this.onAddComponent()}></Button>
          </Col>
        </Row>
      </div>;
    }

    return <div>Coming soon </div>;
	}

  getComponentArray() {
    return this.props.record.getIn(['data', 'components'], List()).toArray();
  }

  onAddComponent() {
    const newComponent = Map({
      id: uuidV1(),
      family: 'dp',
      order: this.props.record.getIn(['data', 'components']).size
    });
    this.props.onUpdateRecord(this.props.record.updateIn(['data', 'components'], c => c.push(newComponent)));
  }

  onComponentFieldChange(id, name, value) {
    let idx = this.props.record.getIn(['data','components']).findIndex(item => {
      return item.get('id') === id;
    });
    
    this.props.onUpdateRecord(this.props.record.setIn(['data', 'components', idx, name], value));
  }
  
  onComponentMultiFieldsChange(id,nameValuePairs) {
    console.log(nameValuePairs);
    let record = this.props.record;
    let idx = this.props.record.getIn(['data','components']).findIndex(item => {
      return item.get('id') === id;
    });

    nameValuePairs.map(nameValue=> {
      let {name,value} = nameValue;
      record = record.setIn(['data','components',idx,name],value);
      return nameValue;
    });

    if (record) {
      this.props.onUpdateRecord(record);
    }    
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