export const ESQUIADORES_PHASES = {
  BETS: 'BETS',
  STARTING_RESULTS: 'STARTING_RESULTS',
  BOOSTS: 'BOOSTS',
  PRELIMINARY_RESULTS: 'PRELIMINARY_RESULTS',
  LAST_CHANGE: 'LAST_CHANGE',
  FINAL_RESULTS: 'FINAL_RESULTS',
} as const;

export const ESQUIADORES_ACTIONS = {
  SUBMIT_CHOICES: 'SUBMIT_CHOICES',
  SUBMIT_BETS: 'SUBMIT_BETS',
};

export const BET_TYPES = {
  INITIAL: 'initial',
  BOOST: 'boost',
  FINAL: 'final',
};

export const SKIER_BET_TYPES = {
  SKIERS_BETS: 'skiersBets',
  SKIERS_BOOST: 'skiersBoost',
};

export const MOUNTAIN_SECTION = {
  SUMMIT: 'SUBMIT', // nothing is display
  LEVEL_1: 'LEVEL_1', // after first decision
  LEVEL_2: 'LEVEL_2', // after second decision
  LODGE: 'LODGE', // after final decision
} as const;

export const LODGE_COLORS = ['#F71735', '#DDB832', '#488B49', '#247BA0', '#683894', '#CC5C3E'];
