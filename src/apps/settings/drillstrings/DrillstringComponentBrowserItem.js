import React, { Component } from 'react';
import { Col } from 'react-materialize';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './DrillstringComponentBrowserItem.css';

class DrillstringComponentBrowserItem extends Component {

	render() {
    return <tr className="c-drillstring-component-browser-item">
      <td>{this.renderComponentImage()}</td>
      <td>{this.renderComponentLabelField('family')}</td>
      <td>{this.renderComponentLabelField('name')}</td>
      <td>{this.renderComponentLabelField('outer_diameter')}</td>
      <td>{this.renderComponentLabelField('inner_diameter')}</td>
      <td>{this.renderComponentLabelField('adjust_linear_weight')}</td>
      <td>{this.renderComponentLabelField('total_length')}</td>
      <td>{this.renderComponentLabelField('total_weight')}</td>
      <td>{this.renderComponentLabelField('grade')}</td>
    </tr>;
	}

  renderComponentImage() {
    return <div className={`c-drillstring-component-image                              
                              c-drillstring-component-image--${this.props.component.get('family')}`}>
      </div>;    
  }
  renderComponentLabelField(field,label="",colSize=2,unitType,unit) {
    let value = this.props.component.get(field, '');
    if (value!=='' && unitType && unit) {
      value = this.props.convert.convertValue(value,unitType,unit).formatNumeral('0.0');
    }
    return <Col m={colSize} s={12}>
      <label>{label}</label>
      <br/>
      <label>{value}</label>
    </Col>;
  }
}

DrillstringComponentBrowserItem.propTypes = {
  component: ImmutablePropTypes.map.isRequired  
};

export default DrillstringComponentBrowserItem;