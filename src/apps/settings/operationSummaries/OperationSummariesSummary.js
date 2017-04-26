import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Table, Button } from 'react-materialize';

import './OperationSummariesSummary.css';

class OperationSummariesSummary extends Component { 
  render() {
    
    return (
      <div className="c-op-summaries-summary">
        <Table responsive={true}>
          <tbody>
            <tr>
              <td className="c-op-summaries-summary__layers">
                Summaries
                <h4>{this.props.records.size}</h4>
              </td>              
              <td className="c-op-summaries-summary__action">
                <Button floating large className='lightblue' waves='light' icon='add' onClick={this.props.onAdd} />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

OperationSummariesSummary.propTypes = {
  
  records: ImmutablePropTypes.list.isRequired,
  onAdd: PropTypes.func.isRequired,
  
};

export default OperationSummariesSummary;
