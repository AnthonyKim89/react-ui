import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Table, Button } from 'react-materialize';

import './CasingSummary.css';

class CasingSummary extends Component { 
  render() {
    
    return (
      <div className="c-casing-summary">
        <Table responsive={true}>
          <tbody>
            <tr>
              <td className="c-casing-summary__layers">
                Intervals
                <h4>{this.props.records.size}</h4>
              </td>              
              <td className="c-casing-summary__action">
                <Button floating large className='lightblue' waves='light' icon='add' onClick={this.props.onAdd} />
              </td>
            </tr>
          </tbody>
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
