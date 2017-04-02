import React, {Component, PropTypes} from 'react';
import format from 'date-fns/format';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
import WellTimelineStatusBar from './WellTimelineStatusBar';
import WellTimelineScrollBar from './WellTimelineScrollBar';
import subscriptions from '../../subscriptions';

import './WellTimelineApp.css';

const [ latestSubscription, summarySubscription ] = SUBSCRIPTIONS;

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
  }

  componentWillUnmount() {
    // Unsubscribing from the wits data
    this.props.unsubscribeApp(this.props.id, SUBSCRIPTIONS);
  }

  render() {
    let latestWitsRecord = subscriptions.selectors.getSubData(this.props.data, latestSubscription);
    let summaryData = subscriptions.selectors.getSubData(this.props.data, summarySubscription);
    return (
      <div className="c-well-timeline">
        {summaryData && this.state.scrollBarVisible &&
          <WellTimelineScrollBar
            time={this.props.time}
            data={summaryData}
            onChangeTime={t => this.updateParams(t)} />}
        {summaryData && latestWitsRecord &&
          <WellTimelineStatusBar
            isLive={!this.props.time}
            asset={this.props.asset}
            data={summaryData}
            lastWitsRecord={latestWitsRecord}
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
