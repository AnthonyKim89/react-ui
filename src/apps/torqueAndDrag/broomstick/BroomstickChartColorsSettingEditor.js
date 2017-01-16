import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import ChartColorsEditor from '../../../common/ChartColorsEditor';
import { SUPPORTED_CHART_SERIES } from './constants';

class BroomstickChartColorsSettingEditor extends Component {

  render() {
    return (
      <ChartColorsEditor
        colorDefinitions={Map(SUPPORTED_CHART_SERIES)}
        currentColors={this.props.currentValue}
        onChange={this.props.onChange} />
    );
  }

}

BroomstickChartColorsSettingEditor.propTypes = {
  currentValue: ImmutablePropTypes.map,
  onChange: PropTypes.func.isRequired
};

export default BroomstickChartColorsSettingEditor;