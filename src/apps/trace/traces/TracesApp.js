import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Slider from 'rc-slider';

import { SUBSCRIPTIONS, SUPPORTED_CHART_SERIES } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

const Range = Slider.createSliderWithTooltip(Slider.Range);

import './TracesApp.css';

class TracesApp extends Component {

  render() {
    return (
      <div className="c-traces">
        <div className="c-traces__slider">
          Sed id nisi eu mi sagittis dignissim in id enim. Aliquam convallis, neque eget semper accumsan, tellus justo hendrerit magna, non scelerisque tortor eros ac neque. Proin et lacus lorem. Vestibulum aliquam purus metus, ac consectetur ex lacinia et. Pellentesque eget consectetur urna. Phasellus malesuada, mi id rutrum auctor, ipsum metus ornare odio, a ornare ante erat eu turpis. Phasellus vel mattis purus. Nulla vel nisi arcu. Nam interdum lectus ut maximus congue. Integer non dapibus sapien, varius finibus mi. Maecenas lorem velit, pulvinar euismod dolor ac, congue tristique sapien. Etiam ac lacinia magna.
          <Range min={0} max={20000} defaultValue={[500, 7000]} tipFormatter={value => `${value}%`} pushable={200} vertical={true} />
        </div>
      </div>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || nextProps.coordinates !== this.props.coordinates || nextProps.graphColors !== this.props.graphColors);
  }

  getSeriesColor(field) {
    if (this.props.graphColors && this.props.graphColors.has(field)) {
      return this.props.graphColors.get(field);
    } else {
      return SUPPORTED_CHART_SERIES[field].defaultColor;
    }
  }

}

TracesApp.propTypes = {
  data: ImmutablePropTypes.map,
  graphColors: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired,
};

export default TracesApp;
