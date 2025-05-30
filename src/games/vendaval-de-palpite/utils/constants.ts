export const VENDAVAL_DE_PALPITE_PHASES = {
  BOSS_SELECTION: 'BOSS_SELECTION',
  SECRET_WORD_SELECTION: 'SECRET_WORD_SELECTION',
  PLAYERS_CLUES: 'PLAYERS_CLUES',
  CLUE_EVALUATIONS: 'CLUE_EVALUATIONS',
} as const;

export const VENDAVAL_DE_PALPITE_ACTIONS = {
  SUBMIT_BOSS: 'SUBMIT_BOSS',
  SUBMIT_SECRET_WORD: 'SUBMIT_SECRET_WORD',
  SUBMIT_CLUES: 'SUBMIT_CLUES',
  SUBMIT_EVALUATION: 'SUBMIT_EVALUATION',
  SUBMIT_OUTCOME: 'SUBMIT_OUTCOME',
  SUBMIT_HELP: 'SUBMIT_HELP',
} as const;

export const WRITE_CLUE_TIME = 180;
export const WRITE_CLUE_TIME_FIRST_ROUND = 240;
