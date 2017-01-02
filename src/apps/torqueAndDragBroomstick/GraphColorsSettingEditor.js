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
      <div className="c-graph-colors-setting-editor__color">
        <div className="c-graph-colors-setting-editor__header"
             onClick={() => this.expandOrCollapse('pick_up')}>
          {this.renderCurrentColorIndicator('pick_up')} Pickup
        </div>
        {this.state.expandedPicker === 'pick_up' &&
          <CompactPicker color={this.getCurrentColor('pick_up')}
                         onChange={clr => this.setCurrentColor('pick_up', clr.hex)} />}
      </div>
      <div  className="c-graph-colors-setting-editor__color"> 
        <div className="c-graph-colors-setting-editor__header"
             onClick={() => this.expandOrCollapse('slack_off')}>
          {this.renderCurrentColorIndicator('slack_off')} Slackoff
        </div>
        {this.state.expandedPicker === 'slack_off' &&
          <CompactPicker color={this.getCurrentColor('slack_off')}
                         onChange={clr => this.setCurrentColor('slack_off', clr.hex)} />}
      </div>
      <div className="c-graph-colors-setting-editor__color">
        <div className="c-graph-colors-setting-editor__header"
             onClick={() => this.expandOrCollapse('rotary_off_bottom')}>
          {this.renderCurrentColorIndicator('rotary_off_bottom')} Rotating
        </div>
        {this.state.expandedPicker === 'rotary_off_bottom' &&
          <CompactPicker color={this.getCurrentColor('rotary_off_bottom')}
                         onChange={clr => this.setCurrentColor('rotary_off_bottom', clr.hex)} />}
      </div>
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