import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import './OperationSummariesSummary.css';

class OperationSummariesSummary extends Component { 
  render() {
    
    return (
      <div className="c-op-summaries-summary">
        <Table>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn className="c-op-summaries-summary__layers">
                <p>Summaries</p>
                <h4>{this.props.records.size}</h4>
              </TableRowColumn>              
              <TableRowColumn className="c-op-summaries-summary__action">
                <FloatingActionButton onClick={this.props.onAdd}>
                  <ContentAdd />
                </FloatingActionButton>
              </TableRowColumn>
            </TableRow>
          </TableBody>
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
