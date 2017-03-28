import React, { Component, PropTypes } from 'react';
import { Button } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

class SurveyAttributeForm extends Component {

  render() {
    return <div className="c-survey-attribute-form">
      <h5>Upload Document</h5>
      <input type="file" ref={r => this.uploadField = r} />
      <Button onClick={() => this.props.onUpload(this.uploadField.files[0])}>
        Upload
      </Button>
    </div>;
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
        this.props.onUpdateRecord(this.props.record.mergeIn(['data'], uploadResult));
      }
    }

    render() {
      return <SurveyAttributeForm {...this.props} uploadResult={uploadResult} onUpload={onUpload} />;
    }
  };
}

export default SurveyAttributeForm;
