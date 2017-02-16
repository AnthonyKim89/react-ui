import React, { Component, PropTypes } from 'react';
import { Input } from 'react-materialize';

import { SUPPORTED_TRACES } from './constants';

class TraceSettingEditor extends Component {
  
  render() {
    return (
      <Input type='select' label="Select" value={this.props.currentValue} onChange={e => this.onChange(e)}>
        <option value={undefined}>
        </option>
        {SUPPORTED_TRACES.map(({trace, label}) =>
          <option value={trace} key={trace}>
            {label}
          </option>
        )}
      </Input>
    );
  }

  onChange(event) {
    this.props.onChange(event.target.value);
  }

}

TraceSettingEditor.propTypes = {
  currentValue: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default TraceSettingEditor;