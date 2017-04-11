import React, { Component, PropTypes } from 'react';
import { Input } from 'react-materialize';

import { SUPPORTED_TIME_PERIODS, DEFAULT_TIME_PERIOD } from './constants';

class TraceTimePeriodSettingEditor extends Component {
  
  render() {
    return (
      <Input type='select' label="Select" value={this.props.currentValue || DEFAULT_TIME_PERIOD } onChange={e => this.onChange(e)}>
        { this.renderLabel() }
        {SUPPORTED_TIME_PERIODS.map(({period, label}) =>
          <option value={period} key={period}>
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
    const n = event.target.value && parseFloat(event.target.value);
    this.props.onChange(n);
  }

}

TraceTimePeriodSettingEditor.defaultProps = {
  label: "Choose Time Window",
  isLabelVisible: true,
};

TraceTimePeriodSettingEditor.propTypes = {
  currentValue: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  isLabelVisible: PropTypes.bool
};

export default TraceTimePeriodSettingEditor;