import React, {Component, PropTypes} from 'react';
import {Input} from 'react-materialize';
import {List} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

class RadioEditor extends Component {

  render() {
    return <div className="">
      {this.props.listDefinitions.map(item =>
        < Input
          className="grey lighten-2 black-text"
          name="radio-group"
          type="radio"
          value={item.value}
          key={item.value}
          label={item.label}
          checked={item.value === this.props.currentValue}
          onChange={e => this.onChange(e)} />
      )}      
    </div>;
  }

  onChange(event) {
    this.props.onChange(event.target.value);
  }

}

RadioEditor.propTypes = {
  listDefinitions: ImmutablePropTypes.list.isRequired,
  currentValue: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default RadioEditor;

// A Higher-Order Component that allows setting up an editor component
export const radioEditorForDefinitions =
  listDefinitions => props => 
    <RadioEditor
      {...props}
      listDefinitions={List(listDefinitions)} />;
