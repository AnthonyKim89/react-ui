import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import TabBar from './TabBar';
import WidgetGrid from './widgets/WidgetGrid';
import { wellPage } from './pages/selectors';

import './WellPage.css';

class WellPage extends Component {
  render() {
    const wellId = parseInt(this.props.params.wellId, 10);
    return (
      <div className="c-well-page" >
        {this.props.wellPage &&
          <WidgetGrid widgets={this.props.wellPage.get('widgets')}
                      wellId={wellId}
                      location={this.props.location} />}
        <TabBar page={this.props.params.category} />
      </div>
    );
  }
}

export default connect(
  createStructuredSelector({
    wellPage
  })
)(WellPage);
