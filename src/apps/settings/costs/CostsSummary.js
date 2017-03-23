import React, { Component } from 'react';
import { List, Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Table, Button, Col, Row } from 'react-materialize';
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
    )
  }

  getTotalAndAverage() {
    let total = 0;
    this.props.records.map((record)=> {
        total += parseFloat(record.getIn(["data","cost"]));
    })
    let average = (this.props.records.size>0) ? (total / this.props.records.size).toFixed(2) : 0;
    return {total,average}
  }
}
export default CostsSummary;
