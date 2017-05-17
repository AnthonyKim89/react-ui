import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { isEqual } from 'lodash';

import Convert from '../../../common/Convert';

import './TracesDepthBar.css';

class TracesDepthBar extends Component {

  render() {
    return <div className="c-traces__depth-bar">

      <div className="c-traces__depth-bar__chart">
      </div>

      <div className="c-traces__depth-bar__values">
        <div className="c-traces__depth-bar__values__item">
          <div className="c-traces__depth-bar__values__item__meta-row">
          </div>
          <div className="c-traces__depth-bar__values__item__meta-row">
          </div>
          <div className="c-traces__depth-bar__values__item__meta-row">
          </div>
        </div>
        <div className="c-traces__depth-bar__values__item">
          <div className="c-traces__depth-bar__values__item__meta-row">
            Hole Depth
          </div>
          <div className="c-traces__depth-bar__values__item__meta-row">
            --
          </div>
          <div className="c-traces__depth-bar__values__item__meta-row">
            Unit
          </div>
        </div>
        <div className="c-traces__depth-bar__values__item">
          <div className="c-traces__depth-bar__values__item__meta-row">
            Bit Depth
          </div>
          <div className="c-traces__depth-bar__values__item__meta-row">
            --
          </div>
          <div className="c-traces__depth-bar__values__item__meta-row">
            Unit
          </div>
        </div>
      </div>

    </div>;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.data.equals(this.props.data) ||  !isEqual(this.state, nextState);
  }

}

TracesDepthBar.propTypes = {
  convert: React.PropTypes.instanceOf(Convert).isRequired,
  supportedTraces: PropTypes.array.isRequired,
  data: ImmutablePropTypes.list.isRequired,
};

export default TracesDepthBar;
