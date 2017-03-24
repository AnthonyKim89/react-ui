import React, { Component } from 'react';
import { SUBSCRIPTIONS } from './constants';
import subscriptions from '../../../subscriptions';

import { format as formatDate } from 'date-fns';

import './OptimizationApp.css'

class OptimizationAppFooter extends Component {

	render() {

		let actualData = subscriptions.selectors.getSubData(this.props.data,SUBSCRIPTIONS[1]);		
		if (!actualData) {
			return null;
		}

		let lastDataUpdate = this.props.lastDataUpdate;

		let gamma = actualData.getIn(["data","gamma"]);
    let bit = this.props.convert.ConvertValue(actualData.getIn(["data","bit_depth"]), "length", "ft");
    bit = bit.toFixed(2);
    let inc = actualData.getIn(["data","inclination"]);
        
    return (
			<div className="c-de-optimization__footer">
				{ lastDataUpdate &&
					<span>Last update: {this.formatLastDataUpdate(lastDataUpdate)}</span>
				}
				
				<span> Gamma: {gamma} api </span>
				<span> Bit: {bit} {this.props.convert.GetUnitDisplay('length')} </span>
				<span> Inc: {inc}&deg; </span>

			</div>
		)
	}

	formatLastDataUpdate(lastDataUpdate) {
    const date = new Date(lastDataUpdate * 1000);
    return formatDate(date, 'M/D/YYYY h:mm a');
  }

}

export default OptimizationAppFooter


