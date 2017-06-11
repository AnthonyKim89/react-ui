import React, { Component, PropTypes } from 'react';
import { Row, Col, Button } from 'react-materialize';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import uuidV1 from 'uuid/v1';
import DraggableList from 'react-draggable-list';
import Modal from 'react-modal';

import './DrillstringComponent.css';
import DrillstringComponentEditorItem from './DrillstringComponentEditorItem';
import DrillstringComponentBrowserItem from './DrillstringComponentBrowserItem';
import DrillstringComponentDetailModal from './DrillstringComponentDetailModal';
import './DrillstringComponentDetailModal.css';
class DrillstringComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewComponentId: null
    };
  }

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
        onComponentMultiFieldsChange: this.onComponentMultiFieldsChange.bind(this),
        onDeleteComponent: this.onDeleteComponent.bind(this)
      };

      return <div className="c-drillstring-component">
        {this.props.errors && this.props.errors["bit_count"] ?
          <div style={{color:'red'}}>
            { this.props.errors["bit_count"] }
          </div> : ''
        }
        <DraggableList
          list={this.getComponentArray()}
          itemKey={itm => itm.get('id')}
          template={this.DrillstringComponentEditorItem}
          padding={0}
          unsetZIndex={true}
          commonProps={commonProps}
          container={()=>document.body}
          onMoveEnd={newArr => this.onReorderComponents(List(newArr))} />
        
        <br/>
        <Row>
          <Col m={1}></Col>
          <Col m={11}>
            <Button floating icon="add" onClick={() => this.onAddComponent()}></Button>
          </Col>
        </Row>
      </div>;
    }

    return <div className="c-drillstring-component">
      <table className="c-drillstring-component__view-table">
        <thead>
          <tr>
            <th></th>
            <th>Category</th>
            <th>Name</th>
            <th>OD ({this.props.convert.getUnitDisplay('shortLength')})</th>
            <th>ID ({this.props.convert.getUnitDisplay('shortLength')})</th>
            <th>Linear Weight ({this.props.convert.getUnitDisplay('massPerLength')}) </th>
            <th>Length ({this.props.convert.getUnitDisplay('length')})</th>
            <th>Weight ({this.props.convert.getUnitDisplay('mass')})</th>
            <th>Grade </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.props.record.getIn(['data', 'components'], List()).map((cmp, idx)=> 
            <DrillstringComponentBrowserItem
              key={idx}
              convert={this.props.convert}
              component={cmp}
              viewMore={componentId=>{ this.setState({viewComponentId: componentId}); }} />)}
        </tbody>
      </table>

      <Modal
        isOpen={this.state.viewComponentId? true: false}
        onRequestClose={_=> {this.setState({viewComponentId: null}); }}
        className='c-drillstring-component-detail-modal  grey darken-2'
        overlayClassName='c-drillstring-component-detail-modal__overlay'
        contentLabel="View Component Detail">
        {this.state.viewComponentId &&
          <DrillstringComponentDetailModal
            convert={this.props.convert}
            component={this.getSelectedComponent()}
            onDone={_=> this.setState({viewComponentId: null}) }
          />
        }
      </Modal>
    </div>;
	}

  getComponentArray() {
    return this.props.record.getIn(['data', 'components'], List()).toArray();
  }

  getSelectedComponent() {
    return this.props.record.getIn(['data','components']).find(item => {
      return item.get('id') === this.state.viewComponentId;
    });
  }

  onAddComponent() {
    const newComponent = Map({
      id: uuidV1(),
      family: 'dp',
      order: this.props.record.getIn(['data', 'components']).size
    });
    this.props.onUpdateRecord(this.props.record.updateIn(['data', 'components'], c => c.push(newComponent)));
  }

  onDeleteComponent(id) {
    const record = this.props.record;
    let idx = this.props.record.getIn(['data','components']).findIndex(item => {
      return item.get('id') === id;
    });
    this.props.onUpdateRecord(record.deleteIn(['data', 'components', idx]));
  }

  onComponentFieldChange(id, name, value) {
    let idx = this.props.record.getIn(['data','components']).findIndex(item => {
      return item.get('id') === id;
    });
    
    this.props.onUpdateRecord(this.props.record.setIn(['data', 'components', idx, name], value));
  }
  
  onComponentMultiFieldsChange(id,nameValuePairs) {
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