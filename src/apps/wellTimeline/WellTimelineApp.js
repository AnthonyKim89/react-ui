import React, {Component, PropTypes} from 'react';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import WellTimelineStatusBar from './WellTimelineStatusBar';
import WellTimelineScrollBar from './WellTimelineScrollBar';
import * as api from '../../api';
import subscriptions from '../../subscriptions';

import './WellTimelineApp.css';

class WellTimelineApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scrollBarVisible: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state || nextProps.data !== this.props.data;
  }

  async componentDidMount() {
    // Subscribing to the wits data
    this.props.subscribeApp(
      this.props.id,
      SUBSCRIPTIONS,
      this.props.asset.get('id')
    );

    const timeline = await api.getWellTimeline(this.props.asset.get('id'));
    const jobData = timeline.get('jobData');
    const outOfHoleData = timeline.get('outOfHoleData');

    if (outOfHoleData.isEmpty()) {
      this.setState({timeline, activity: List()});
      return;
    }

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
    this.setState({timeline, activity});
  }

  componentWillUnmount() {
    // Unsubscribing from the wits data
    this.props.unsubscribeApp(this.props.id, SUBSCRIPTIONS);
  }

  render() {
    subscriptions.selectors.firstSubData(this.props.data, SUBSCRIPTIONS);
    return (
      <div className="c-well-timeline">
        {this.state.timeline && this.state.scrollBarVisible &&
          <WellTimelineScrollBar
            time={this.props.time}
            data={this.props.data}
            tooltipDepthData={this.state.timeline.get('tooltipDepthData')}
            activity={this.state.activity}
            onChangeTime={t => this.updateParams(t)} />}
        {this.state.timeline && 
          <WellTimelineStatusBar
            isLive={!this.props.time}
            asset={this.props.asset}
            data={this.props.data}
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
  data: ImmutablePropTypes.map,
  asset: ImmutablePropTypes.map.isRequired,
  time: PropTypes.string,
  onUpdateParams: PropTypes.func.isRequired,
  subscribeApp: PropTypes.func.isRequired,
  unsubscribeApp: PropTypes.func.isRequired,
};

export default WellTimelineApp;
