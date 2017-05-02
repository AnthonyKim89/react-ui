import React, {Component, PropTypes} from 'react';
import {Input} from 'react-materialize';

import './TextEditor.css';

class TextEditor extends Component {

  render() {
    return <div className="">
        <Input
          className="c-settings-text grey lighten-2 black-text"
          defaultValue={this.props.currentValue || this.props.defaultValue || ''}
          label={this.props.label || ''}
          onChange={e => this.onChange(e)} />
    </div>;
  }

  onChange(event) {
    this.props.onChange(parseFloat(event.target.value));
  }

}

TextEditor.propTypes = {
  label: PropTypes.string,
  currentValue: PropTypes.number,
  defaultValue: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

export default TextEditor;

// A Higher-Order Component that allows setting up an editor component
export const textEditorForDefinitions =
  (label, defaultValue) => props =>
    <TextEditor
      {...props}
      defaultValue={defaultValue}
      label={label} />;
