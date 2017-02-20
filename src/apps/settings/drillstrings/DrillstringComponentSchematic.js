import React, { Component } from 'react';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import './DrillstringComponentSchematic.css';

class DrillstringComponentSchematic extends Component {

  render() {
    return <div className="c-drillstring-component-schematic">
      {this.props.drillstring.getIn(['data', 'components'], List()).map((cmp, idx) => 
        <div className="c-drillstring-component-schematic__component">
          <div className="c-drillstring-component-schematic__number">
            {idx + 1}
          </div>
          <div className={`c-drillstring-component-schematic__component-image
                          c-drillstring-component-schematic__component-image--${cmp.get('type')}`} />
        </div>)}
    </div>;
  }

}

DrillstringComponentSchematic.propTypes = {
  drillstring: ImmutablePropTypes.map.isRequired
};

export default DrillstringComponentSchematic;