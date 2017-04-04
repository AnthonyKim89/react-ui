import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Table, Button } from 'react-materialize';
import moment from 'moment';

import './NPTEventsSummary.css';

class NPTEventsSummary extends Component { 
  render() {
    
    return (
    	<div className="c-npt-summary">
    		<Table centered={true} responsive={true}>
    			<tbody>
    				<tr>
    					<td>
    						Events
    						<h4>{this.props.records.size}</h4>
    					</td>
    					<td>
    						NPT Time 
    						<h4>{this.getTotalNPTTime()}</h4>
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

  getTotalNPTTime() {
    let sum = 0;
    this.props.records.map((record) => {
        sum = sum + record.getIn(["data","end_time"]) - record.getIn(["data","start_time"]);
        return record;
    });
    
    let duration = moment.duration(sum*1000);
    let d= Math.floor(duration.asDays());
    let h = Math.floor(duration.asHours());
    let m= duration.minutes();
    let result="";
    if (d>0 || h>0) {
        if (d>0) {
            result+= d + " days ";
        }        
        if (h-d*24>0) {
            result+= (h - d*24) + " hrs";
        }
        return result;
    }
            
    if (m>0) {
        return m+ " mins";
    }
    
    return 0;
  }
}

NPTEventsSummary.propTypes = {
  
  records: ImmutablePropTypes.list.isRequired,
  onAdd: PropTypes.func.isRequired,
  
};

export default NPTEventsSummary;
