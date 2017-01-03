import React, {Component, PropTypes} from 'react';
import {CompactPicker} from 'react-color';
import {Map} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { DEFAULT_GRAPH_COLORS } from './constants';

import './GraphColorsSettingEditor.css';

class GraphColorsSettingEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {expandedPicker: null};
  }

  render() {
    return <div className="c-graph-colors-setting-editor">
      {this.renderColor('pick_up', 'Pickup')}
      {this.renderColor('slack_off', 'Slackoff')}
      {this.renderColor('rotary_off_bottom', 'Rotating')}
    </div>;
  }

  renderColor(type, label) {
    return <div className="c-graph-colors-setting-editor__color">
      <div className="c-graph-colors-setting-editor__header"
            onClick={() => this.expandOrCollapse(type)}>
        {this.renderCurrentColorIndicator(type)} {label}
      </div>
      {this.state.expandedPicker === type &&
        <CompactPicker color={this.getCurrentColor(type)}
                        onChange={clr => this.setCurrentColor(type, clr.hex)} />}
    </div>;
  }

  renderCurrentColorIndicator(type) {
    return <span className="c-graph-colors-setting-editor__color-box"
                 style={{backgroundColor: this.getCurrentColor(type)}}>
    </span>
  }

  expandOrCollapse(type) {
    if (this.state.expandedPicker === type) {
      this.setState({expandedPicker: null});
    } else {
      this.setState({expandedPicker: type});
    }
  }

  getCurrentColor(type) {
    if (this.props.currentValue && this.props.currentValue.has(type)) {
      return this.props.currentValue.get(type);
    } else {
      return DEFAULT_GRAPH_COLORS[type];
    }
  }
  
  setCurrentColor(type, color) {
    const current = this.props.currentValue || Map();
    this.setState({expandedPicker: null});
    this.props.onChange(current.set(type, color));
  }

}

GraphColorsSettingEditor.propTypes = {
  currentValue: ImmutablePropTypes.map,
  onChange: PropTypes.func.isRequired
};

export default GraphColorsSettingEditor;