import React, { Component, PropTypes } from 'react';
import { Button, Col, Row } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import CasingTable from './CasingTable';

class CasingViewer extends Component {

  render() {
    return <div className="c-casing-viewer">
      <h4>Casing</h4>
      <Row>
        <Col m={11}></Col>
        <Col>
          <Button floating large icon="mode_edit" onClick={() => this.props.onEdit()}></Button>
        </Col>
      </Row>
      <Row>
        <Col m={12}>
          <CasingTable casing={this.props.casing}
                      isEditable={false} />
        </Col>
      </Row>
    </div>;
  }

}

CasingViewer.propTypes = {
  casing: ImmutablePropTypes.map.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default CasingViewer;
