import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import TracesChartColumn from './TracesChartColumn';

import './TracesChartContainer.css';

class TracesChartContainer extends Component {
  render() {
    return <div className="c-traces__container">
      <TracesChartColumn data={this.props.data} widthCols={this.props.widthCols}/>
      <TracesChartColumn data={this.props.data} widthCols={this.props.widthCols}/>
      <TracesChartColumn data={this.props.data} widthCols={this.props.widthCols}/>
      <TracesChartColumn data={this.props.data} widthCols={this.props.widthCols}/>
    </div>;
  }
}

TracesChartContainer.propTypes = {
  data: ImmutablePropTypes.list.isRequired,
  widthCols: PropTypes.number.isRequired,
};

export default TracesChartContainer;
