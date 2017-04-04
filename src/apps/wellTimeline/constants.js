export const NAME = 'wellTimeline';

export const SUBSCRIPTIONS = [
  {provider: 'corva', collection: 'wits'},
  {provider: 'corva', collection: 'wits-summary-60m', params: {initial: 240, behavior: "accumulate"}}
];
