import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button} from 'react-materialize';
import moment from 'moment';

import './DailyReportsItem.css';
class DailyReportsItem extends Component { 
  
  render() {

    let {timestamp,data:{file}} = this.props.record.toJS();
    let url = `https://s3.amazonaws.com/corva-files/${file}`;
    return (
      <tr className="c-daily-reports-item">
        <td><a href={url} target="_blank">{file.split("/")[1]}</a></td>
        <td>{moment.unix(timestamp).format('LLL')}</td>
        <td className="hide-on-med-and-down"></td>
        <td className="hide-on-med-and-down">
          <Button floating className='red view-action' waves='light' icon='remove' onClick={() => this.remove()}/>
        </td>
      </tr>
    );   
  }

  remove() {
    this.props.onRemove(this.props.record);
  }

}

DailyReportsItem.propTypes = {  
  record: ImmutablePropTypes.map.isRequired
};

export default DailyReportsItem;
