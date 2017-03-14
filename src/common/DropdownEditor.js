import React, {Component, PropTypes} from 'react';
import {Input} from 'react-materialize';
import {List} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

class DropdownEditor extends Component {

  render() {
    return <div className="">
      <Input
        className="grey lighten-2 black-text"
        type="select"
        value={this.props.currentValue}
        onChange={e => this.onChange(e)}>
        {this.props.listDefinitions.map(item =>
          <option className="grey lighten-2 black-text" value={item.value} key={item.value}>
            {item.label}
          </option>
        )}
      </Input>
    </div>;
  }

  onChange(event) {
    const currentValue = event.target.value && parseInt(event.target.value, 10);
    this.props.onChange(currentValue);
  }

}

DropdownEditor.propTypes = {
  listDefinitions: ImmutablePropTypes.list.isRequired,
  currentValue: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

export default DropdownEditor;

// A Higher-Order Component that allows setting up an editor component
export const dropdownEditorForDefinitions =
  listDefinitions => props => 
    <DropdownEditor
      {...props}
      listDefinitions={List(listDefinitions)} />;
