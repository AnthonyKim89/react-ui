import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button} from 'react-materialize';
import moment from 'moment';
import * as api from '../../../api';

import './FilesDocumentsItem.css';
class FilesDocumentsItem extends Component { 
  
  render() {

    let {timestamp,data:{file_name, display_name}} = this.props.record.toJS();
    let url = api.getFileDownloadLink(file_name);
    return (
      <tr className="c-files-documents-item">
        <td><a href={url} download={display_name}>{display_name}</a></td>
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

FilesDocumentsItem.propTypes = {  
  record: ImmutablePropTypes.map.isRequired
};

export default FilesDocumentsItem;
