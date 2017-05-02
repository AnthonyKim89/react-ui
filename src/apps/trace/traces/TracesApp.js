import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';

import LoadingIndicator from '../../../common/LoadingIndicator';
import TracesSlider from './TracesSlider';
import subscriptions from '../../../subscriptions';
import { SUBSCRIPTIONS } from './constants';

import './TracesApp.css';

const [ _, summarySubscription ] = SUBSCRIPTIONS;

class TracesApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      start: 0,
      end: 0,
      filteredData: new List()
    };
  }

  render() {
    let summaryData = subscriptions.selectors.getSubData(this.props.data, summarySubscription, false);
    if (!summaryData) {
      return <LoadingIndicator/>;
    }

    return <div className="c-traces">
      <TracesSlider summaryData={summaryData} widthCols={this.props.widthCols} rangeChanged={(start, end) => this.updateFilteredData(start, end)}/>
    </div>;
  }

  updateFilteredData(start=null, end=null) {
    start = start || this.state.start;
    end = end || this.state.end;
    let summaryData = subscriptions.selectors.getSubData(this.props.data, summarySubscription, false);

    let firstTimestamp = summaryData.first().get("timestamp");
    let lastTimestamp = summaryData.last().get("timestamp");

    let startTS = firstTimestamp + start * (lastTimestamp - firstTimestamp);
    let endTS = firstTimestamp + end * (lastTimestamp - firstTimestamp);

    let filteredData = summaryData.filter(point => {
      let ts = point.get('timestamp');
      return ts >= Math.round(startTS) && ts <= Math.round(endTS);
    });

    this.setState({
      start,
      end,
      filteredData
    });

    console.log(filteredData);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || nextProps.coordinates !== this.props.coordinates || nextProps.graphColors !== this.props.graphColors);
  }
}

TracesApp.propTypes = {
  data: ImmutablePropTypes.map,
  size: PropTypes.string.isRequired,
  widthCols: PropTypes.number.isRequired,
};

export default TracesApp;
