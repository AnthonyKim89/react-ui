import React, {Component, PropTypes} from 'react'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import { List } from 'immutable';

import WellTimelineStatusBar from './WellTimelineStatusBar'
import WellTimelineScrollBar from './WellTimelineScrollBar'
import * as api from '../../api';

import './WellTimelineApp.css'

class WellTimelineApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scrollBarVisible: false
    };
  }

  async componentDidMount() {
    this._mounted = true;
    const timeline = await api.getWellTimeline(this.props.assetId);
    const jobData = timeline.get('jobData');
    const outOfHoleData = timeline.get('outOfHoleData');
    if (!outOfHoleData.isEmpty()) {
      const firstDate = parse(jobData.get('start_date')).getTime();
      const lastDate = parse(jobData.get('last_date')).getTime();
      const activity = outOfHoleData.map((item, index) => {
        const itemEndTime = parse(item.get('end_time')).getTime();
        const itemStartTime = parse(item.get('start_time')).getTime();
        let relativeDuration = (itemEndTime - itemStartTime) / (lastDate - firstDate) * 100;
        let relativeStart  = (itemStartTime - firstDate) / (lastDate - firstDate) * 100;
        return Map({
          activity: item.get('activity'),
          relativeStart,
          relativeDuration
        });
      });
      if (this._mounted) this.setState({timeline, activity});
    } else {
      if (this._mounted) this.setState({timeline, activity: List()});
    }
  }

  componentWillUnmount() {
    this._mounted = false;
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
            isLive={!this.props.time}
            jobData={this.state.timeline.get('jobData')}
            lastWitsRecord={this.state.timeline.get('lastWitsRecord')}
            isScrollBarVisible={this.state.scrollBarVisible}
            onToggleDrillScrollBar={() => this.toggleScrollBar()} />}
      </div>
    );
  }

  toggleScrollBar() {
    this.setState(s => ({scrollBarVisible: !s.scrollBarVisible}));
  }

  updateParams(time) {
    this.props.onUpdateParams({time: time && format(time)});
  }
}

WellTimelineApp.propTypes = {
  assetId: PropTypes.string.isRequired,
  time: PropTypes.string,
  onUpdateParams: PropTypes.func.isRequired
};

export default WellTimelineApp;
