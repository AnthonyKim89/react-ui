import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import './CrewsContactSummary.css';

class CrewsContactSummary extends Component { 
  render() {
    
    return (
    	<div className="c-crews-summary">
    		<Table>
    			<TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn className="c-crews-summary__layers">
                <p>Layers</p>
                <h4>{this.props.records.size}</h4>
              </TableRowColumn>              
              <TableRowColumn className="c-crews-summary__action">
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

CrewsContactSummary.propTypes = {
  
  records: ImmutablePropTypes.list.isRequired,
  onAdd: PropTypes.func.isRequired,
  
};

export default CrewsContactSummary;
