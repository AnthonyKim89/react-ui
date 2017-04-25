import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Table, Button } from 'react-materialize';

import './WellSectionsSummary.css';

class WellSectionsSummary extends Component { 
  render() {
    
    return (
      <div className="c-wellsections-summary">
        <Table responsive={true}>
          <tbody>
            <tr>
              <td className="c-wellsections-summary__layers">
                Sections
                <h4>{this.props.records.size}</h4>
              </td>              
              <td className="c-wellsections-summary__action">
                <Button floating large className='lightblue' waves='light' icon='add' onClick={this.props.onAdd} />
              </td>
            </tr>
          </tbody>
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
