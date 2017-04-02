import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Table, Button } from 'react-materialize';

import './CrewsContactSummary.css';

class CrewsContactSummary extends Component { 
  render() {
    
    return (
    	<div className="c-crews-summary">
    		<Table centered={true} responsive={true}>
    			<tbody>
            <tr>
              <td>
                Layers
                <h4>{this.props.records.size}</h4>
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
}

CrewsContactSummary.propTypes = {
  
  records: ImmutablePropTypes.list.isRequired,
  onAdd: PropTypes.func.isRequired,
  
};

export default CrewsContactSummary;
