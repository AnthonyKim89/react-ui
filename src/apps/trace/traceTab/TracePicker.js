import React, { Component, PropTypes } from 'react';
import { Button, Input } from 'react-materialize';

import { SUPPORTED_TRACES } from '../constants';

import './TracePicker.css';

class TracePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTrace: props.trace
    };
  }

  render() {
    return <div>
      <h4>Select Trace</h4>
      <Input
        type="select"
        value={this.state.selectedTrace}
        onChange={e => this.setState({selectedTrace: e.target.value})}>
        {SUPPORTED_TRACES.map(({trace, label}) =>
          <option key={trace} value={trace}>{label}</option>
        )}
      </Input>
      <Button onClick={() => this.props.onTraceChange(this.state.selectedTrace)}>
        Select
      </Button>
    </div>;
  }

}

TracePicker.propTypes = {
  trace: PropTypes.string,
  onTraceChange: PropTypes.func.isRequired
};

export default TracePicker;
