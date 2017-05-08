import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { SUBSCRIPTIONS } from './constants';
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
        {subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS) ?
          <div className="c-asset-status-container">
            <a className="c-asset-status__asset-link">View Asset &gt;</a>
            <div className={"c-asset-status-bar "+this.getAssetStatusColorClass()}></div>
            <div className="c-asset-status-content">
              <div className="c-asset-status-content__title">Rig ABC 123</div>
              <div className="c-asset-status-content__subtitle">Well Ranch HG 2</div>
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
    const status = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS).getIn(["data","status"]);
    return `${cssPrefix}${status.get("state")}`;
  }

  getAssetStatusMessage() {
    const status = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS).getIn(["data","status"]);
    const message = status.get("message");
    if (message && message.length>0) {
      return message;
    }
    return null;
  }

  getAssetSummary() {
    const summary = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS).getIn(["data","summary"]);
    return summary;
  }

  getAssetDepth() {
    const data = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS).getIn(["data"]);
    const bitDepth = parseFloat(data.get("bit_depth")).formatNumeral("0,0");
    const holeDepth = parseFloat(data.get("hole_depth")).formatNumeral("0,0");
    return `${bitDepth} / ${holeDepth} ${this.props.convert.getUnitDisplay("length")}`;
  }

  getAssetGeneralActivity() {
    const data = subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS).getIn(["data"]);
    return data.getIn(["activity","general"]);
  }

}

AssetStatusApp.propTypes = {
  data: ImmutablePropTypes.map,
  title: PropTypes.string,
};

export default AssetStatusApp;
