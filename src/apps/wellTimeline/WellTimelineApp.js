import React, {Component, PropTypes} from 'react'
import moment from 'moment';
import { List } from 'immutable';

import WellTimelineStatusBar from './WellTimelineStatusBar'
import WellTimelineScrollBar from './WellTimelineScrollBar'
import * as api from '../../api';

import './WellTimelineApp.css'

class WellTimeline extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scrollBarVisible: false
    };
  }

  async componentDidMount() {
    const timeline = await api.getWellTimeline(this.props.assetId);
    const jobData = timeline.get('jobData');
    const outOfHoleData = timeline.get('outOfHoleData');
    if (!outOfHoleData.isEmpty()) {
      const firstDate = moment(jobData.get('start_date')).unix() || 0;
      const lastDate = moment(jobData.get('last_date')).unix() || 0;
      const activity = outOfHoleData.map((item, index) => {
        const itemEndTime = moment(item.get('end_time')).unix();
        const itemStartTime = moment(item.get('start_time')).unix();
        let relativeDuration = (itemEndTime - itemStartTime) / (lastDate - firstDate) * 100;
        let relativeStart  = (itemStartTime - firstDate) / (lastDate - firstDate) * 100;
        return Map({
          activity: item.get('activity'),
          relativeStart,
          relativeDuration
        });
      });
      this.setState({timeline, activity});
    } else {
      this.setState({timeline, activity: List()});
    }
    if (!this.props.time) {
      const lastTooltipDepth = timeline.get('tooltipDepthData').last();
      const time = lastTooltipDepth ? moment(lastTooltipDepth.get('entry_at')) : moment();
      this.updateParams(time);
    }
  }

  render() {
    return (
      <div className="c-well-timeline">
        {this.state.timeline && this.state.scrollBarVisible && 
          <WellTimelineScrollBar
            time={this.props.time}
            tooltipDepthData={this.state.timeline.get('tooltipDepthData')}
            activity={this.state.activity}
            onChangeTime={t => this.updateParams(t)} />}
        {this.state.timeline && 
          <WellTimelineStatusBar
            jobData={this.state.timeline.get('jobData')}
            lastWitsRecord={this.state.timeline.get('lastWitsRecord')}
            scrollBarVisible={this.state.scrollBarVisible}
            onToggleDrillScrollBar={() => this.toggleScrollBar()} />}
      </div>
    );
  }

  toggleScrollBar() {
    this.setState(s => ({scrollBarVisible: !s.scrollBarVisible}));
  }

  updateParams(time) {
    this.props.onUpdateParams({time: time.toISOString()});
  }
}

WellTimeline.propTypes = {
  assetId: PropTypes.number.isRequired,
  time: PropTypes.string,
  onUpdateParams: PropTypes.func.isRequired
};

export default WellTimeline;
