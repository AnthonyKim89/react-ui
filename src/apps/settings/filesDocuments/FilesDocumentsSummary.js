import React, { Component} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import LinearProgress from 'material-ui/LinearProgress';
import moment from 'moment';

import S3Upload from 'react-s3-uploader/s3upload.js';

import * as api from '../../../api';

import './FilesDocumentsSummary.css';

class FilesDocumentsSummary extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      currentUpload: null
    };
    
    this.uploadFile = this.uploadFile.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.onError = this.onError.bind(this);
    this.onAbort = this.onAbort.bind(this);
  }

  render() {
    
    return (
      <div className="c-files-documents-summary">
        <Table selectable={false}>
          <TableBody displayRowCheckbox={false} stripedRows={false}>
            <TableRow displayBorder={false}>
              <TableRowColumn className="c-files-documents-summary-file">
                <p>
                  Recent files
                </p>
                <Table selectable={false}>
                  <TableBody displayRowCheckbox={false} stripedRows={false}>
                    {this.props.recentRecords.map(record=> {

                      let {_id,timestamp,data:{file_name, display_name}} = record.toJS();
                      let url = api.getFileDownloadLink(file_name);
                      return (
                        <TableRow key={_id} displayBorder={false}>
                          <TableRowColumn style={{width: '55%'}}>
                            <a href={url} download={display_name}>{display_name}</a>
                          </TableRowColumn>
                          <TableRowColumn style={{width:'45%'}}>{moment.unix(timestamp).format('LLL')}</TableRowColumn>
                        </TableRow>
                      );
                    })}              
                  </TableBody>
                </Table>
              </TableRowColumn>
              <TableRowColumn className="c-files-documents-summary-action hide-on-med-and-down">
                <div className="file-field input-field">
                  <div className="btn-floating btn-large c-files-documents-summary-action__download-button">
                    <span>
                      <i className="large material-icons">backup</i>
                    </span>
                    <input type="file" onChange={this.uploadFile} ref={(f)=>this.fileInput = f}/>
                  </div>
                  <div className="file-path-wrapper" style={{width:0}}>
                    <input className="file-path validate" type="text"/>
                  </div>
                </div>
              </TableRowColumn>
            </TableRow>
            {this.state.currentUpload ?
              <TableRow>
                <TableRowColumn>
                  <div>
                    <span>{this.state.currentUpload.progressMessage}</span>
                    {this.state.currentUpload.percent?
                    <span>-{this.state.currentUpload.percent}%</span> : ""}
                  </div>
                  <LinearProgress mode="determinate" value={this.state.completed} />
                </TableRowColumn>
                <TableRowColumn>
                  <FloatingActionButton className="view-action" mini={true} secondary={true} onClick={()=>this.onAbort()}>
                    <ContentRemove />
                  </FloatingActionButton>
                </TableRowColumn>            
              </TableRow> : <TableRow></TableRow>
            }
          </TableBody>
        </Table>
      </div>
    );
  }

  uploadFile() {
    this.clearUpload();
    let uploader = new S3Upload({
      fileElement: this.fileInput,      
      getSignedUrl: this.getSignedUrl,
      preprocess: this.preprocess,
      onProgress: this.onProgress,
      onFinishS3Put: this.onFinish,
      onError: this.onError,
    });
        
    this.setState({currentUpload: {
      uploader: uploader,
      fileName: null,
      percent: null,
      progressMessage: "Preparing uploading..."
    }});
  }

  async getSignedUrl(file,callback) {
    let data = await api.getS3SignedUrl(file.name,file.type);    
    // Add node for 'signedUrl' which is the expected name by uploader component
    data = data.set("signedUrl", data.get('signed_url'));
    callback(data.toJS());    
  }

  preprocess(file,next) {    
    next(file);
  }

  clearUpload() {
    let currentUpload = this.state.currentUpload;    
    currentUpload && currentUpload.uploader && currentUpload.uploader.abortUpload();
  }

  onProgress(percent,progressMessage) {
    this.setState ({currentUpload: Object.assign({},this.state.currentUpload, {
      percent: percent,
      progressMessage: progressMessage
    })});
  }

  onFinish(urlObj) {
    const record = this.props.record.update('data',(oldMap) => {
      return oldMap.set("file_name", urlObj.file_name).set("display_name", urlObj.display_name);
    });

    this.props.onSave(record);
    this.setState({currentUpload:null});
  }

  onError() {
  }

  onAbort() {
    this.clearUpload();
    this.setState({currentUpload:null});
  }

}

FilesDocumentsSummary.propTypes = {    
};

export default FilesDocumentsSummary;
