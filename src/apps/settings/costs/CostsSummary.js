import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import moment from 'moment';

import './CostsSummary.css';

class CostsSummary extends Component { 
  render() {
    let {total,average} = this.getTotalAndAverage();
    return (
      <div className="c-costs-summary">
        <Table>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>
                <p>Total Costs</p>
                <h4>${parseFloat(total).formatNumeral('0,0.00')}</h4>
              </TableRowColumn>
              <TableRowColumn>
                <p>Cost / Day</p>
                <h4>${parseFloat(average).formatNumeral('0,0.00')}</h4>
              </TableRowColumn>
              <TableRowColumn style={{textAlign: 'center'}}>
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

  getTotalAndAverage() {
    let total = 0;
    let days = 0;
    let daysList = {};
    this.props.records.map((record)=> {
        let dayKey = moment.unix(record.getIn(["data","date"])).format("MM/DD/YYYY");        
        if (!daysList[dayKey]) {
            daysList[dayKey] = 1;
            days++;
        }        
        total += parseFloat(record.getIn(["data","cost"]));
        return record;
    });
    let average = (days>0) ? (total / days).toFixed(2) : 0;
    total = total.toFixed(2) || 0;
    return {total,average};
  }
}

CostsSummary.propTypes = {
  
  records: ImmutablePropTypes.list.isRequired,
  onAdd: PropTypes.func.isRequired,
  
};

export default CostsSummary;
