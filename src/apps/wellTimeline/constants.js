export const NAME = 'wellTimeline';

export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'wits'},
  // TODO: Once we get real data flowing, use this sub instead:
  //{provider: 'corva', collection: 'wits-summary-60m', params: {initial: 240, behavior: "accumulate"}}
  {provider: 'corva', collection: 'wits-summary-60m', params: {initial: 215}}
];
