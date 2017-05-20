import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';

import { STATE_CATEGORY_MAP, SUBSCRIPTIONS } from './constants';
import LoadingIndicator from '../../../common/LoadingIndicator';
import subscriptions from '../../../subscriptions';

import './AssetStatusApp.css';

class AssetStatusApp extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.data !== this.props.data || nextProps.coordinates !== this.props.coordinates);
  }

  render() {
    return (
      <div className="c-asset-status">
        {this.props.asset && subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS) ?
          <div className="c-asset-status-container">
            <Link to={`/assets/${this.props.asset.get("id")}/overview`} className="c-asset-status__asset-link">
              View Asset &gt;
            </Link>            
            <div className={"c-asset-status-bar "+this.getAssetStatusColorClass()}></div>
            <div className="c-asset-status-content">
              <div className="c-asset-status-content__title">{this.props.asset.get("parent_asset_name")}</div>
              <div className="c-asset-status-content__subtitle">{this.props.asset.get("name")}</div>
              <div className="c-asset-status-content__depth">
                <span>Depth: </span>
                <span>{this.getAssetDepth()}</span>
              </div>
              <div className="c-asset-status-content__general-activity">
                <span> Current: </span>
                <span className={this.getAssetGeneralActivity()==="drilling"? "activity-drilling": "activity-other"}>{this.getAssetGeneralActivity()}</span>
              </div>
              {this.getAssetStatusMessage()? 
                <div className={"c-asset-status-content__status-message " + this.getAssetStatusColorClass()}> {this.getAssetStatusMessage()} </div> : ''
              }
              <div className="c-asset-status-content__when">previous 24 hrs</div>
              <div className="c-asset-status-content__summary">{this.getAssetSummary()}</div>
            </div>
          </div>
          :
        <LoadingIndicator/> }
      </div>
    );
  }

  getAssetStatusColorClass() {    
    const cssPrefix = "asset-status-";

    // TODO: Change to poll collections
    const status = "optimal";
    return `${cssPrefix}${status}`;
  }

  getAssetStatusMessage() {
    /*
    const status = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS).getIn(["data","status"]);
    const message = status.get("message");
    if (message && message.length>0) {
      return message;
    }
    */
    return null;
  }

  getAssetSummary() {
    if(subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[1])) {
      let data = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[1]).getIn(["data"]);
      let summary = data.getIn(["summary"]);
      let timestamp = data.getIn(["date_time"]);
      let min_ts = Math.round((new Date().getTime()) / 1000) - 86400;
      // Timestamp greater than now minus 24 hours
      if(timestamp >= min_ts) {
        return summary;
      }
    }
    return "-";
  }

  getAssetDepth() {
    const data = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[0]).getIn(["data"]);
    const bitDepth = parseFloat(data.get("bit_depth")).formatNumeral("0,0.0");
    const holeDepth = parseFloat(data.get("hole_depth")).formatNumeral("0,0.0");
    return `${bitDepth} / ${holeDepth} ${this.props.convert.getUnitDisplay("length")}`;
  }

  getAssetGeneralActivity() {
    let state = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[0]).getIn(["data", "state"]);
    return STATE_CATEGORY_MAP[state];
  }

}

AssetStatusApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default AssetStatusApp;
