import React, { Component } from 'react';
import { format as formatDate } from 'date-fns';

import './AppFooter.css'
class AppFooter extends Component {

	render() {
		const {lastDataUpdate,others} = this.props.data;

		return (
			<div className="c-app-container__footer">
				{ lastDataUpdate &&
					<span>Last update: {this.formatLastDataUpdate(lastDataUpdate)}</span>
				}
				{others&& 
					others.map((info,index) => 
					<span key={index}> {info.name}: {info.value}</span> )
				}
				
			</div>
			)
	}

	formatLastDataUpdate(lastDataUpdate) {
    const date = new Date(lastDataUpdate * 1000);
    return formatDate(date, 'M/D/YYYY h:mm a');
  }

}

export default AppFooter


