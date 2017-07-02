import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import './WellSectionsSummary.css';

class WellSectionsSummary extends Component { 
  render() {
    
    return (
      <div className="c-wellsections-summary">
        <Table>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn className="c-wellsections-summary__layers">
                <p>Sections</p>
                <h4>{this.props.records.size}</h4>
              </TableRowColumn>              
              <TableRowColumn className="c-wellsections-summary__action" style={{textAlign: 'center'}}>
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

WellSectionsSummary.propTypes = {
  
  records: ImmutablePropTypes.list.isRequired,
  onAdd: PropTypes.func.isRequired,
  
};

export default WellSectionsSummary;
