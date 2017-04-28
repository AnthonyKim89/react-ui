import React, {Component, PropTypes} from 'react';
import {Input} from 'react-materialize';
import {List} from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

class DropdownEditor extends Component {

  render() {
    return <div className="">
      <Input
        className="dropdown-editor grey lighten-2 black-text"
        type="select"
        value={this.props.currentValue}
        onChange={e => this.onChange(e)}>
        { this.renderLabel() }
        {this.props.listDefinitions.map(item =>
          <option className="grey lighten-2 black-text" value={item.value} key={item.value}>
            {item.label}
          </option>
        )}
      </Input>
    </div>;
  }

  renderLabel() {
    return this.props.isLabelVisible ? 
    <option value="" disabled defaultValue="true">{this.props.label}</option>
    : "";
  }

  onChange(event) {
    const currentValue = event.target.value && parseInt(event.target.value, 10);
    this.props.onChange(currentValue);
  }
}

DropdownEditor.propTypes = {
  listDefinitions: ImmutablePropTypes.list.isRequired,
  currentValue: PropTypes.number,
  label: PropTypes.string,
  isLabelVisible: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

DropdownEditor.defaultProps = {
  label: "Choose An Option",
  isLabelVisible: true,
};

export default DropdownEditor;

// A Higher-Order Component that allows setting up an editor component
export const dropdownEditorForDefinitions =
  listDefinitions => props => 
    <DropdownEditor
      {...props}
      listDefinitions={List(listDefinitions)} />;
