import React, { Component, PropTypes } from 'react';
import { Input } from 'react-materialize';

import { SUPPORTED_TRACES } from './constants';

class TraceSettingEditor extends Component {
  
  render() {
    return (
      <Input type='select' label="Select" value={this.props.currentValue} onChange={e => this.onChange(e)}>
        { this.renderLabel() }
        {SUPPORTED_TRACES.map(({trace, label}) =>
          <option value={trace} key={trace}>
            {label}
          </option>
        )}
      </Input>
    );
  }

  renderLabel() {
    return this.props.isLabelVisible ? 
    <option value="" disabled defaultValue="true">{this.props.label}</option>
    : "";
  }

  onChange(event) {
    this.props.onChange(event.target.value);
  }

}

TraceSettingEditor.defaultProps = {
  label: "Choose A Curve",
  isLabelVisible: true,
};

TraceSettingEditor.propTypes = {
  currentValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  isLabelVisible: PropTypes.bool
};

export default TraceSettingEditor;