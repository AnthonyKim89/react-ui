import React, { Component } from 'react';
import { Button } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './DrillstringComponentBrowserItem.css';

class DrillstringComponentBrowserItem extends Component {

	render() {
    return <tr className="c-drillstring-component-browser-item">
      <td>{this.renderComponentImage()}</td>
      <td>{this.renderComponentLabelField('family')}</td>
      <td>{this.renderComponentLabelField('name')}</td>
      <td>
        {this.props.component.get('family') === "bit" &&  this.renderComponentLabelField('size','shortLength','in')}
        {this.props.component.get('family') !== "bit" &&  this.renderComponentLabelField('outer_diameter','shortLength','in')}        
      </td>
      <td>{this.renderComponentLabelField('inner_diameter','shortLength','in')}</td>
      <td>{this.renderComponentLabelField('linear_weight', "massPerLength", "lb-ft")}</td>
      <td>{this.renderComponentLabelField('length', "length","ft")}</td>
      <td>{this.renderComponentLabelField('weight', "mass","lb")}</td>
      <td>{this.renderComponentLabelField('grade')}</td>
      <td> 
        <Button floating icon="view_headline" onClick={() => {this.props.viewMore(this.props.component.get('id')); }}></Button>
      </td>
    </tr>;
	}

  renderComponentImage() {
    return <div className={`c-drillstring-component-image                              
                            c-drillstring-component-image--${this.props.component.get('family')}`}>
      </div>;    
  }
  renderComponentLabelField(field,unitType,unit) {
    let value = this.props.component.get(field) || '';
    let numberFormat;
    if (value!=='' && unitType && unit) {
      numberFormat='0.00';
      value = this.props.convert.convertValue(value,unitType,unit);
    };
    if (value!=='' && !unitType && !unit) {
      numberFormat='0';
    }
    if (numberFormat && value.formatNumeral) {
      value = value.formatNumeral(numberFormat);
    }
    return value;
  }
}

DrillstringComponentBrowserItem.propTypes = {
  component: ImmutablePropTypes.map.isRequired  
};

export default DrillstringComponentBrowserItem;