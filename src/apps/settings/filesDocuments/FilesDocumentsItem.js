import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import moment from 'moment';
import * as api from '../../../api';

import './FilesDocumentsItem.css';
class FilesDocumentsItem extends Component { 
  
  render() {

    let {timestamp,data:{file_name, display_name}} = this.props.record.toJS();
    let url = api.getFileDownloadLink(file_name);
    const objTableRowStyle = {height: '70px'};

    return (
      <TableRow className="c-files-documents-item" style={objTableRowStyle}>
        <TableRowColumn className="c-files-documents__file-column"><a href={url} download={display_name}>{display_name}</a></TableRowColumn>
        <TableRowColumn className="c-files-documents__date-column">{moment.unix(timestamp).format('LLL')}</TableRowColumn>
        <TableRowColumn className="c-files-documents__user-column hide-on-med-and-down"></TableRowColumn>
        <TableRowColumn className="c-files-documents__action-column hide-on-med-and-down">
          <FloatingActionButton className="view-action" mini={true} secondary={true} onClick={() => this.remove()}>
            <ContentRemove />
          </FloatingActionButton>
        </TableRowColumn>
      </TableRow>
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
