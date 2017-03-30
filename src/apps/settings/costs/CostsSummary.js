import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Table, Button } from 'react-materialize';
import moment from 'moment';

import './CostsSummary.css';

class CostsSummary extends Component { 
  render() {
    let {total,average} = this.getTotalAndAverage();
    return (
    	<div className="c-costs-summary">
    		<Table centered={true} responsive={true}>
    			<tbody>
    				<tr>
    					<td>
    						Total Costs
    						<h4>${total}</h4>
    					</td>
    					<td>
    						Cost / Day 
    						<h4>${average}</h4>
    					</td>
    					<td>
    						<Button floating large className='lightblue' waves='light' icon='add' onClick={this.props.onAdd} />
    					</td>
    				</tr>
    			</tbody>
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
    return {total,average};
  }
}

CostsSummary.propTypes = {
  
  records: ImmutablePropTypes.list.isRequired,
  onAdd: PropTypes.func.isRequired,
  
};

export default CostsSummary;
