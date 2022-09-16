export const ACTIONS = {
  SUBMIT_CHALLENGE: 'SUBMIT_CHALLENGE',
  SUBMIT_CONTENDERS: 'SUBMIT_CONTENDERS',
  SUBMIT_BETS: 'SUBMIT_BETS',
  SUBMIT_VOTES: 'SUBMIT_VOTES',
};

export const voteTarget: Record<number, number> = {
  0: 8,
  1: 8,
  2: 9,
  3: 9,
  4: 10,
  5: 10,
  6: 11,
  7: 11,
  8: 12,
  9: 12,
  10: 13,
  11: 13,
  12: 14,
  13: 14,
};

export const targetByTier: Record<WBracketTier, number> = {
  quarter: 4,
  semi: 2,
  final: 1,
  winner: 0,
};

export const DEFAULT_BETS = { quarter: '', semi: '', final: '' };

export const TIER_BY_STEP: Record<number, WBracketTier> = {
  0: 'final',
  1: 'semi',
  2: 'quarter',
};
