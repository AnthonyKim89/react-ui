import React, { Component, PropTypes } from 'react';
import { Button, Row, Col, Input } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import DrillstringSummary from './DrillstringSummary';
import DrillstringComponentTable from './DrillstringComponentTable';

import './DrillstringBrowser.css';

class DrillstringBrowser extends Component {

  render() {
    return <div className="c-drillstring-browser">
      <h4>Drillstrings/BHAs</h4>
      <Row>
        <Input m={11}
               label="Drillstring"
               type="select"
               onChange={evt => this.onSelectChange(evt.target.value)}>
            {this.props.drillstrings.map(ds =>
              <option key={ds.get('_id')} value={ds.get('_id')}>
                BHA #{ds.getIn(['data', 'id'])}
              </option>
            )}
        </Input>
        <Col m={1}>
          <Button floating large icon="add" onClick={() => this.props.onNewDrillstring()} />
        </Col>
      </Row>
      {this.props.displayingDrillstring &&
        <div>
          <DrillstringSummary
            drillstring={this.props.displayingDrillstring}
            isReadOnly={false}
            onEditDrillstring={this.props.onEditDrillstring} />
          <DrillstringComponentTable
            drillstring={this.props.displayingDrillstring}
            isEditable={false} />
        </div>}
    </div>;
  }

  onSelectChange(id) {
    this.props.onSelectDrillstring(this.props.drillstrings.find(ds => ds.get('_id') === id));
  }
}

DrillstringBrowser.propTypes = {
  drillstrings: ImmutablePropTypes.list.isRequired,
  displayingDrillstring: ImmutablePropTypes.map,
  onSelectDrillstring: PropTypes.func.isRequired,
  onNewDrillstring: PropTypes.func.isRequired,
  onEditDrillstring: PropTypes.func.isRequired
};

export default DrillstringBrowser;