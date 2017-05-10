import React, {Component, PropTypes} from 'react';
import {Input} from 'react-materialize';

class SwitchEditor extends Component {

  render() {
    return <div className="">
      <Input 
        name='on'
        type='switch'
        defaultChecked={typeof this.props.currentValue==='undefined' ? this.props.defaultValue : this.props.currentValue}
        onChange={e=> this.onChange(e)}      
      />
    </div>;
  }

  onChange(event) {
    this.props.onChange(event.target.checked);
  }

}

SwitchEditor.propTypes = {
  currentValue: PropTypes.bool,
  defaultValue: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default SwitchEditor;

// A Higher-Order Component that allows setting up an editor component
export const switchEditorForDefinitions =
  (defaultValue) => props =>
    <SwitchEditor
      {...props}
      defaultValue={defaultValue}
    />;
