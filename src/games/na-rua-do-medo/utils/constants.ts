export const NA_RUA_DO_MEDO_PHASES = {
  TRICK_OR_TREAT: 'TRICK_OR_TREAT',
  RESULT: 'RESULT',
  STREET_END: 'STREET_END',
} as const;

export const NA_RUA_DO_MEDO_ACTIONS = {
  SUBMIT_DECISION: 'SUBMIT_DECISION',
} as const;

export const GRID_REPEAT: Dictionary<number> = {
  3: 3,
  4: 4,
  5: 5,
  6: 3,
  7: 4,
  8: 4,
  9: 5,
  10: 5,
};

export const OUTCOME_STATUS = {
  CONTINUE: 'CONTINUE',
  NEW_STREET: 'NEW_STREET',
  END_STREET: 'END_STREET',
};

export const DECISIONS = {
  CONTINUE: 'CONTINUE',
  GO_HOME: 'GO_HOME',
  HOME: 'HOME',
};
