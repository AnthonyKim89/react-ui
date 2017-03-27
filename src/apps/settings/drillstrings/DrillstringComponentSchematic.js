import React, { Component, PropTypes } from 'react';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import DraggableList from 'react-draggable-list';

import './DrillstringComponentSchematic.css';

const makeSchematicComponent = (isEditable) => {
  return class extends Component {
    render() {
      return <div className="c-drillstring-component-schematic__component"
                  key={this.props.item.get('order')}>
        <div className="c-drillstring-component-schematic__number">
          {this.props.item.get('order') + 1}
        </div>
        {isEditable ?
          this.props.dragHandle(this.renderImage()) :
          this.renderImage()}
      </div>;
    }

    renderImage() {
      return <div className={`c-drillstring-component-schematic__component-image
                              c-drillstring-component-schematic__component-image--${this.props.item.get('family')}`}>
      </div>;
    }

  };
};

class DrillstringComponentSchematic extends Component {

  componentWillMount() {
    this.SchematicComponent = makeSchematicComponent(this.props.isEditable);
  }

  render() {
    return <div className="c-drillstring-component-schematic">
      <DraggableList
        list={this.getComponentArray()}
        itemKey={itm => itm.get('id')}
        template={this.SchematicComponent}
        padding={0}
        onMoveEnd={newArr => this.props.onReorderComponents(List(newArr))} />
    </div>;
  }

  getComponentArray() {
    return this.props.drillstring.getIn(['data', 'components'], List()).toArray();
  }

}

DrillstringComponentSchematic.propTypes = {
  drillstring: ImmutablePropTypes.map.isRequired,
  isEditable: PropTypes.bool.isRequired,
  onReorderComponents: PropTypes.func
};

export default DrillstringComponentSchematic;