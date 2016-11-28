import React, {Component, PropTypes} from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes';

import WellTimelineStatusBar from './WellTimelineStatusBar'
import WellTimelineScrollBar from './WellTimelineScrollBar'

import './WellTimeline.css'

class WellTimeline extends Component {
  render() {
    return (
      <div className="c-well-timeline">
        <WellTimelineScrollBar
          tooltipDepthData={this.props.timeline.get('tooltipDepthData')}
          activity={this.props.timeline.get('activity')}
          onChangeDrillTime={this.props.onChangeDrillTime} />
        <WellTimelineStatusBar
          jobData={this.props.timeline.get('jobData')}
          lastWitsRecord={this.props.timeline.get('lastWitsRecord')} />
      </div>
    );
  }
}

WellTimeline.propTypes = {
  timeline: ImmutablePropTypes.map.isRequired,
  onChangeDrillTime: PropTypes.func.isRequired
};

export default WellTimeline;
