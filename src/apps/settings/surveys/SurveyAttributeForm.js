import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {ProgressBar} from 'react-materialize';

import S3Upload from 'react-s3-uploader/s3upload.js';

import * as api from '../../../api';
import './SurveyAttributeForm.css';

class SurveyAttributeForm extends Component {

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
    return <div className="c-survey-attribute-form">
      <h5>Upload Document</h5>
      <div className="file-field input-field">
        <div className="btn-floating btn-large c-survey-attribute-form__download-button">
          <span>
            <i className="large material-icons">backup</i>
          </span>
          <input type="file" onChange={this.uploadFile} ref={(f)=>this.fileInput = f}/>
        </div>
        <div className="file-path-wrapper" style={{width:0}}>
          <input className="file-path validate" type="text"/>
        </div>
      </div>

      {this.state.currentUpload?
      <div>
        <div>
          <span>{this.state.currentUpload.progressMessage}</span>
          {this.state.currentUpload.percent?
          <span>-{this.state.currentUpload.percent}%</span> : ""}
        </div>
        <ProgressBar progress={this.state.currentUpload.percent}/> 
      </div>
      : "" }
      
    </div>;
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
    this.setState({currentUpload: null});
    this.props.onUpload(urlObj.file_name);    
  }

  onError() {
  }

  onAbort() {
    this.setState({currentUpload: null});
    this.clearUpload();    
  }

}

SurveyAttributeForm.propTypes = {
  record: ImmutablePropTypes.map.isRequired,
  onUpdateRecord: PropTypes.func.isRequired
};

export function attributeFormWithUpload(uploadResult, onUpload) {
  return class extends React.Component {

    componentWillMount() {
      // If there's a new uploadResult, pass it into the record editor through the attribute form's
      // regular onUpdateRecord callback.      
      if (uploadResult) {
        let record = this.props.record;
        if (record.getIn(['data','stations'])) {
          record = record.updateIn(['data','stations'], old => old.concat(uploadResult.get('stations')));
        }
        else {
          record = record.mergeIn(['data'], uploadResult);
        }

        this.props.onUpdateRecord(record);
      }
    }

    render() {
      return <SurveyAttributeForm {...this.props} uploadResult={uploadResult} onUpload={onUpload} />;
    }
  };
}

export default SurveyAttributeForm;
