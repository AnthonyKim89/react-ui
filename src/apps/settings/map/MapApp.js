import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Button, Input, Row, Col} from 'react-materialize';
import { Map } from 'immutable';
import NotificationSystem from 'react-notification-system';
import L from 'mapbox.js';
import 'mapbox.js/theme/style.css';

import * as api from '../../../api';

import {METADATA} from './constants';
import parseLatLng from './helpers';
import './MapApp.css';

class MapApp extends Component {

  constructor(props) {
    super(props);
    L.mapbox.accessToken = 'pk.eyJ1IjoiYm9yaXMtcGV0cm92IiwiYSI6ImNqMG5nbXV4ZTAwYW8yd2xkZmJldjQ3b2QifQ.AYJSB4RNRS7kpk0q_Z4kgw';
    this.state = {};
  }

  componentDidMount() {    
    this.map = L.mapbox.map(this.mapContainer).setView([40, -74.50], 8);
    L.mapbox.styleLayer('mapbox://styles/mapbox/dark-v9').addTo(this.map);
    this._notificationSystem = this.refs.notificationSystem;
    if (this.props.asset) {
      this.loadRecords(this.props.asset);
    }
  }

  async loadRecords(asset) {
    const records = await api.getAppStorage(METADATA.recordProvider, METADATA.recordCollection, asset.get('id'), Map({limit: 1}));
    let record = records.get(0);      
    this.setState({
      record: record,
      topHole: record?record.getIn(["data","topHole"]):'',
      bottomHole: record?record.getIn(["data","bottomHole"]):''
    });
    this.updateMap();    
  }

  render() {
    return (      
      <div className="c-map">
        <h4>{METADATA.title}</h4>
        <div>{METADATA.subtitle}</div> 
        {this.state.topHole!==undefined && this.state.bottomHole!==undefined ?
          <Row className="c-map-latlng">
            <Col m={5} s={12}>
              <Input type="text"
                s={12}
                label="Asset Top Hole Location"
                defaultValue={this.state.topHole}
                onChange={(e)=>this.setState({topHole:e.target.value})}/>
            </Col>

            <Col m={5} s={12}>            
              <Input type="text"
                s={12}
                label="Asset Bottom Hole Location"
                defaultValue={this.state.bottomHole}
                onChange={(e)=>this.setState({bottomHole:e.target.value})}/>
            </Col>
            <Button waves='light' onClick={()=>this.save()}>save</Button>
          </Row>: '' }
        <NotificationSystem ref="notificationSystem"/>
        <div id="map" ref={(mapContainer)=>this.mapContainer=mapContainer}></div>        
      </div>
    );
  }
  
  async save() {    
    
    let tLatLng = parseLatLng(this.state.topHole);
    let bLatLng = parseLatLng(this.state.bottomHole);
    if (tLatLng.length===2 && bLatLng.length ===2) {
      const data = Map({
        topHole: this.state.topHole,
        bottomHole: this.state.bottomHole
      });

      const record = (this.state.record || Map({
        asset_id: this.props.asset.get('id'),
        data: Map({})
      })).set("data",data);
      
      const savedRecord = record.has('_id')? 
        await api.putAppStorage(METADATA.recordProvider, METADATA.recordCollection, record.get('_id') , record) :
        await api.postAppStorage(METADATA.recordProvider, METADATA.recordCollection, record);

      this.setState({record: savedRecord});
      this.updateMap();
      
    } else {
      this._notificationSystem.addNotification({
        message: "We are not able to parse the given geolocation data.",
        level: 'error'
      });  
    }

  }

  updateMap() {
    if (!this.state.record) {
      return;
    }

    let tLatLng = parseLatLng(this.state.record.getIn(["data","topHole"]));
    let bLatLng = parseLatLng(this.state.record.getIn(["data","bottomHole"]));

    if (tLatLng.length===2 && bLatLng.length ===2) {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker(tLatLng);
      this.map.addLayer(this.marker);
      this.map.setView(tLatLng,8);
    }

  }
  
}

MapApp.propTypes = {
  asset: ImmutablePropTypes.map
};

export default MapApp;
