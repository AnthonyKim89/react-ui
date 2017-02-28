import React, { Component } from 'react';

import * as api from '../../../api';

import './SurveysApp.css';

class SurveysApp extends Component {

  render() {
    return <div className="c-surveys">
      <input type="file" ref={r => this.uploadField = r} />
      <button onClick={() => this.upload()}>Upload</button>
    </div>;
  }

  async upload() {
    const res = await api.postTaskDocument(
      'corva.data',
      'parse-survey-document',
      this.uploadField.files[0]
    );
    console.log(res);
  }

}

export default SurveysApp;