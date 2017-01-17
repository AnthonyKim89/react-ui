import React, {Component, PropTypes} from 'react';
import {CompactPicker} from 'react-color';
import {Map} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './ChartColorsEditor.css';

class ChartColorsEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {expandedPicker: null};
  }

  render() {
    return <div className="c-chart-colors-editor">
      {this.props.colorDefinitions.entrySeq().map(([color, def]) => 
        this.renderColor(color, def.label)
      )}
    </div>;
  }

  renderColor(type, label) {
    return <div key={type} className="c-chart-colors-editor__color">
      <div className="c-chart-colors-editor__header"
            onClick={() => this.expandOrCollapse(type)}>
        {this.renderCurrentColorIndicator(type)} {label}
      </div>
      {this.state.expandedPicker === type &&
        <CompactPicker color={this.getCurrentColor(type)}
                       onChange={clr => this.setCurrentColor(type, clr.hex)} />}
    </div>;
  }

  renderCurrentColorIndicator(type) {
    return <span className="c-chart-colors-editor__color-box"
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
    if (this.props.currentValue && this.props.currentValue.get(type)) {
      return this.props.currentValue.get(type);
    } else {
      return this.props.colorDefinitions.get(type).defaultColor;
    }
  }
  
  setCurrentColor(type, color) {
    const current = this.props.colors || Map();
    this.setState({expandedPicker: null});
    this.props.onChange(current.set(type, color));
  }

}

ChartColorsEditor.propTypes = {
  colorDefinitions: ImmutablePropTypes.map.isRequired,
  currentValue: ImmutablePropTypes.map,
  onChange: PropTypes.func.isRequired
};

export default ChartColorsEditor;

// A Higher-Order Component that allows setting up an editor component
// for certain color definitions
export const chartColorsEditorForDefinitions =
  colorDefinitions => props => 
    <ChartColorsEditor
      {...props}
      colorDefinitions={Map(colorDefinitions)} />;
