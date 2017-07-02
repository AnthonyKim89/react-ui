import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import './CasingSummary.css';

class CasingSummary extends Component { 
  render() {
    
    return (
      <div className="c-casing-summary">
        <Table>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn className="c-casing-summary__layers">
                <p>Intervals</p>
                <h4>{this.props.records.size}</h4>
              </TableRowColumn>              
              <TableRowColumn className="c-casing-summary__action">
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

CasingSummary.propTypes = {
  
  records: ImmutablePropTypes.list.isRequired,
  onAdd: PropTypes.func.isRequired,
  
};

export default CasingSummary;
