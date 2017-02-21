import React, { Component, PropTypes } from 'react';
import { Button, Col, Row } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import CasingTable from './CasingTable';

class CasingEditor extends Component {

  render() {
    return <div className="c-casing-editor">
      <h4>Edit Casing</h4>
      <Row>
        <Col m={12}>
          <CasingTable casing={this.props.casing}
                       isEditable={true}
                       onAddItem={this.props.onAddItem}
                       onDeleteItem={this.props.onDeleteItem}
                       onItemFieldChange={this.props.onItemFieldChange} />
        </Col>
      </Row>
      {this.renderActions()}
    </div>;
  }

  renderActions() {
    return <Row className="c-casing-editor__actions">
      <Col m={12}>
        <Button onClick={() => this.props.onSave()}>
          Save
        </Button>
        &nbsp;or&nbsp;
        <a onClick={() => this.props.onCancel()}>
          Cancel
        </a>
      </Col>
    </Row>;
  }

}

CasingEditor.propTypes = {
  casing: ImmutablePropTypes.map.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onItemFieldChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default CasingEditor;
