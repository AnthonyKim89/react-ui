import React, {Component, PropTypes} from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes';

import WellTimelineStatusBar from './WellTimelineStatusBar'
import WellTimelineScrollBar from './WellTimelineScrollBar'

import './WellTimeline.css'

class WellTimeline extends Component {
  render() {
    return (
      <div className="c-well-timeline">
        {this.props.timeline.get('scrollBarVisible') && 
          <WellTimelineScrollBar
            drillTime={this.props.timeline.get('currentTime')}
            tooltipDepthData={this.props.timeline.get('tooltipDepthData')}
            activity={this.props.timeline.get('activity')}
            onChangeDrillTime={this.props.onChangeDrillTime} />}
        <WellTimelineStatusBar
          jobData={this.props.timeline.get('jobData')}
          lastWitsRecord={this.props.timeline.get('lastWitsRecord')}
          scrollBarVisible={this.props.timeline.get('scrollBarVisible')}
          onToggleDrillScrollBar={this.props.onToggleDrillScrollBar} />
      </div>
    );
  }
}

WellTimeline.propTypes = {
  timeline: ImmutablePropTypes.map.isRequired,
  onToggleDrillScrollBar: PropTypes.func.isRequired,
  onChangeDrillTime: PropTypes.func.isRequired
};

export default WellTimeline;
