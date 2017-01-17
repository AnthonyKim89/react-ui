import React, { Component, PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';

import { SUPPORTED_TIME_PERIODS, DEFAULT_TIME_PERIOD } from './constants';

class TraceTimePeriodSettingEditor extends Component {
  
  render() {
    return (
      <FormControl
        componentClass="select"
        placeholder="Select"
        value={this.props.currentValue || DEFAULT_TIME_PERIOD }
        onChange={e => this.onChange(e)}>
        <option value={undefined}>
        </option>
        {SUPPORTED_TIME_PERIODS.map(({period, label}) =>
          <option value={period} key={period}>
            {label}
          </option>
        )}
      </FormControl>
    );
  }

  onChange(event) {
    const n = event.target.value && parseFloat(event.target.value);
    this.props.onChange(n);
  }

}

TraceTimePeriodSettingEditor.propTypes = {
  currentValue: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

export default TraceTimePeriodSettingEditor;