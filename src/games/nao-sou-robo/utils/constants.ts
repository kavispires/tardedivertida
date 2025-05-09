export const NAO_SOU_ROBO_PHASES = {
  CARD_SELECTION: 'CARD_SELECTION',
  ARE_YOU_A_ROBOT: 'ARE_YOU_A_ROBOT',
  RESULTS: 'RESULTS',
} as const;

export const NAO_SOU_ROBO_ACTIONS = {
  SUBMIT_CARD: 'SUBMIT_CARD',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
} as const;

export const OUTCOME = {
  CONTINUE: 'CONTINUE',
  TOO_SUSPICIOUS: 'TOO_SUSPICIOUS',
  ROBOT_WINS: 'ROBOT_WINS',
  HUMANS_WIN: 'HUMANS_WIN',
} as const;

export const SUSPICION_THRESHOLD = 3;

export const BEAT_THRESHOLD = 3;
