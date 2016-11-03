import { Map, List } from 'immutable';
import * as t from './actions';

const initialState = Map({data: List()});

function constructGraphData(data) {
  const broomstick = data.get('broomstick');
  const slackoffPredicted = broomstick.get('all_SlackOff_Predicted').map(record => {
    const slackoffOffset = parseFloat(record.get('HL_Predicted'));
    const bitDepth = parseFloat(record.get('measured_depth'));
    return {slackoff_offset_x: slackoffOffset, slackoff_offset_y: bitDepth};
  });
  const rotatingPredicted = broomstick.get('all_Rotating_Predicted').map(record => {
    const drillingOffset = parseFloat(record.get('HL_Predicted'));
    const bitDepth = parseFloat(record.get('measured_depth'));
    return {drilling_offset_x: drillingOffset, drilling_offset_y: bitDepth};
  });
  const pickUpPredicted = broomstick.get('all_PickUp_Predicted').map(record => {
    const pickupOffset = parseFloat(record.get('HL_Predicted'));
    const bitDepth = parseFloat(record.get('measured_depth'));
    return {pickup_offset_x: pickupOffset, pickup_offset_y: bitDepth};
  });
  const pickUpActual = broomstick.get('all_PickUp_Actual').map(record => {
    const pickupOffset = parseFloat(record.get('HL_Actual'));
    const bitDepth = parseFloat(record.get('measured_depth'));
    return {pickup_x: pickupOffset, pickup_y: bitDepth};
  });
  const rotatingActual = broomstick.get('all_Rotating_Actual').map(record => {
    const rotatingOffset = parseFloat(record.get('HL_Actual'));
    const bitDepth = parseFloat(record.get('measured_depth'));
    return {rotating_x: rotatingOffset, rotating_y: bitDepth};
  });
  const slackoffActual = broomstick.get('all_SlackOff_Actual').map(record => {
    const slackoffOffset = parseFloat(record.get('HL_Actual'));
    const bitDepth = parseFloat(record.get('measured_depth'));
    return {slackoff_x: slackoffOffset, slackoff_y: bitDepth};
  });
  return slackoffPredicted
    .concat(rotatingPredicted)
    .concat(pickUpPredicted)
    .concat(pickUpActual)
    .concat(rotatingActual)
    .concat(slackoffActual);
}

export default function(state = initialState, action) {
  switch (action.type) {
    case t.START_LOAD:
      return state.merge({
        isLoading: true
      });
    case t.FINISH_LOAD:
      return state.merge({
        isLoading: false,
        data: constructGraphData(action.data)
      });
    default:
      return state;
  }
};
