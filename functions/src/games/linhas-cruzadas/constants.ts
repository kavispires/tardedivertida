/**
 * Phase identifiers used by the `linhas-cruzadas` engine.
 */
export const LINHAS_CRUZADAS_PHASES = {
  SETUP: 'SETUP',
  PROMPT_SELECTION: 'PROMPT_SELECTION',
  DRAWING: 'DRAWING',
  NAMING: 'NAMING',
  PRESENTATION: 'PRESENTATION',
  GAME_OVER: 'GAME_OVER',
} as const;

/**
 * Player action identifiers accepted by the `linhas-cruzadas` engine.
 */
export const LINHAS_CRUZADAS_ACTIONS = {
  SUBMIT_PROMPT: 'SUBMIT_PROMPT',
  SUBMIT_DRAWING: 'SUBMIT_DRAWING',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
} as const;

/**
 * The standard number of rounds played in a game.
 */
export const TOTAL_ROUNDS = 1;

/**
 * Minimum and maximum numbers of players supported by this game.
 */
export const PLAYER_COUNTS = {
  MIN: 4,
  MAX: 10,
} as const;
