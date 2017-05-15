import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Row, Col, Button } from 'react-materialize';

import Convert from '../../../common/Convert';

import './TracesBoxColumn.css';

class TracesBoxColumn extends Component {

  render() {
    return <div className="c-traces__box-column">
      <Row s={12} className="c-traces__box-column__box-row">
        <Col s={12}>
          Foo<br/>
          --<br/>
          ft
        </Col>
      </Row>
      <Button className="black white-text" waves='light'>+</Button>
    </div>;
  }

}

TracesBoxColumn.propTypes = {
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  supportedTraces: PropTypes.array.isRequired,
  data: ImmutablePropTypes.list.isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default TracesBoxColumn;
