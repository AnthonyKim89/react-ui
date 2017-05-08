import React, { Component } from 'react';
import { SUBSCRIPTIONS } from './constants';
import subscriptions from '../../../subscriptions';
import { format as formatDate } from 'date-fns';

import './AssetStatusApp.css';

class AssetStatusAppFooter extends Component {

  render() {
    const lastDataUpdate = this.props.lastDataUpdate;
    if (!subscriptions.selectors.firstSubData(this.props.data,SUBSCRIPTIONS)) {
      return null;
    }
    return (
      <div className="c-asset-status__footer">
        { lastDataUpdate &&
          <span>Last update: {this.formatLastDataUpdate(lastDataUpdate)}</span>
        }
        { !lastDataUpdate && 
          <span> No last update date available </span>
        }
      </div>
    );    
  }

  formatLastDataUpdate(lastDataUpdate) {
    const date = new Date(lastDataUpdate * 1000);
    return formatDate(date, 'M/D/YYYY h:mm a');
  }

}

export default AssetStatusAppFooter;
