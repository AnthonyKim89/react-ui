export const NAME = 'wellTimeline';

export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'wits', params: {alwaysSubscribe: true}},
  // TODO: Once we get real data flowing, use this sub instead:
  //{provider: 'corva', collection: 'wits-summary-60m', params: {initial: 240, behavior: "accumulate", alwaysSubscribe: true}}
  {provider: 'corva', collection: 'wits-summary-60m', params: {initial: 215, alwaysSubscribe: true}}
];
