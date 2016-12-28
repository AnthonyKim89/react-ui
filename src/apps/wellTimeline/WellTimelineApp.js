import React, {Component, PropTypes} from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes';

import WellTimelineStatusBar from './WellTimelineStatusBar'
import WellTimelineScrollBar from './WellTimelineScrollBar'

import './WellTimelineApp.css'

class WellTimeline extends Component {

  constructor(props) {
    super(props);
    this.state = {scrollBarVisible: false};
  }

  render() {
    return (
      <div className="c-well-timeline">
        {this.state.scrollBarVisible && 
          <WellTimelineScrollBar
            drillTime={this.props.timeline.get('currentTime')}
            tooltipDepthData={this.props.timeline.get('tooltipDepthData')}
            activity={this.props.timeline.get('activity')}
            onChangeDrillTime={this.props.onChangeDrillTime} />}
        <WellTimelineStatusBar
          jobData={this.props.timeline.get('jobData')}
          lastWitsRecord={this.props.timeline.get('lastWitsRecord')}
          scrollBarVisible={this.state.scrollBarVisible}
          onToggleDrillScrollBar={() => this.toggleScrollBar()} />
      </div>
    );
  }

  toggleScrollBar() {
    this.setState(s => ({scrollBarVisible: !s.scrollBarVisible}));
  }
}

WellTimeline.propTypes = {
  timeline: ImmutablePropTypes.map.isRequired,
  onChangeDrillTime: PropTypes.func.isRequired
};

export default WellTimeline;
