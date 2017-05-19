export const CATEGORY = 'asset';
export const NAME = 'assetStatus';
export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'wits'},
  {provider: 'corva', collection: 'data.operation-summaries'}
];
export const METADATA = {
  settingsTitle: 'Asset Status',
  fullSize: true,
  disableDisplayAssetName: true,
  developer: {name: 'Corva', url: 'http://www.corva.ai/'},
  version: 'v0.1',
  publishedAt: '2017-05-08T00:00:00'
};
export const SUPPORTED_ASSET_TYPES = ['rig'];
export const INITIAL_SIZE = {w: 4, h: 10};


export const STATE_CATEGORY_MAP = {
  'DrillSlide(Slide mode drilling)': "Drilling Slide",
  'DrillRot(Rotary mode drilling)': "Drilling Rotary",
  'InSlips': "Connection",
  'Unclassified(Circulating)': "Circulating",
  'StaticPump(Circulating)': "Circulating",
  'StaticPumpRot(Circulating&Rot)': "Circulating",
  'Rih(Tripping in)': "Run in Hole",
  'Pooh(Tripping out)': "Run out of Hole",
  'PoohPump(Sliding out)': "Washing Upwards",
  'RihPump(Sliding in)': "Washing Downwards",
  'PoohPumpRot(Reaming out)': "Reaming Upwards",
  'RihPumpRot(Reaming in)': "Reaming Downwards",
  'Unclassified': "Other",
  'UnclassifiedPumpRot': "Other",
  'Static(Off bottom)': "Other",
  'CasingRunning': "Running Casing",
  'CasingTrippingIn': "Casing Trip In",
  'CementingAndWaiting': "Cementing",
};

